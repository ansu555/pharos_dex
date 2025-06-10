import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import SimpleAmmABI from "@/app/abis/SimpleAmm.json";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS;

interface Token {
  symbol: string;
  name: string;
  logoURI?: string;
  address: string;
  decimals: number;
  chainId: number;
}

interface SwapLogicReturn {
  tokens: Token[];
  fromToken: string;
  setFromToken: (address: string) => void;
  toToken: string;
  setToToken: (address: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  slippage: number;
  setSlippage: (slippage: number) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
  canSwap: boolean;
  quoteWei: bigint;
  minAmountOut: bigint;
  swap: (() => Promise<void>) | null;
  swapLoading: boolean;
  swapSuccess: boolean;
  swapError: string | null;
}

export function useSwapLogic(): SwapLogicReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [quoteWei, setQuoteWei] = useState<bigint>(BigInt(0));

  // load token list
  useEffect(() => {
    fetch("https://messari.io/tokenlist/messari-verified.json")
      .then((r) => r.json())
      .then((j) => {
        const evm1 = j.tokens
          .filter((t: Token) => t.chainId === 1)
          .slice(0, 20);
        setTokens(evm1);
        if (evm1.length >= 2) {
          setFromToken(evm1[0].address);
          setToToken(evm1[1].address);
        }
      });
  }, []);

  // Effect to connect to wallet and get provider/signer
  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Provider = new (ethers as any).BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          const web3Signer = await web3Provider.getSigner();
          setSigner(web3Signer);
        } catch (err) {
          console.error("Failed to connect wallet:", err);
          setSwapError("Failed to connect wallet");
        }
      } else {
        console.log("Please install MetaMask!");
        setSwapError("Please install MetaMask");
      }
    };
    connectWallet();
  }, []);

  const canSwap =
    !!fromToken &&
    !!toToken &&
    amount !== "" &&
    fromToken !== toToken;

  // parse input → wei
  const fromDecimals =
    (tokens.find((t) => t.address === fromToken) || {}).decimals || 18;
  const amountWei = useMemo(() => {
    try {
      return parseUnits(amount || "0", fromDecimals);
    } catch {
      return BigInt(0);
    }
  }, [amount, fromDecimals]);

  // direction flag for AMM
  const isAToB = useMemo(
    () => fromToken.toLowerCase() < toToken.toLowerCase(),
    [fromToken, toToken]
  );

  // Effect to get quote using ethers
  useEffect(() => {
    const fetchQuote = async () => {
      if (provider && canSwap && amountWei !== BigInt(0)) {
        try {
          const ammContract = new ethers.Contract(
            AMM_ADDRESS || "",
            SimpleAmmABI.abi,
            provider
          );
          const rawQuote = await ammContract.getAmountOut(amountWei, isAToB);
          setQuoteWei(BigInt(rawQuote.toString()));
        } catch (err) {
          console.error("Failed to fetch quote:", err);
          setQuoteWei(BigInt(0));
          setSwapError("Failed to fetch quote");
        }
      } else {
        setQuoteWei(BigInt(0));
      }
    };
    fetchQuote();
  }, [provider, canSwap, amountWei, isAToB]);

  // apply slippage
  const minAmountOut = useMemo(() => {
    if (quoteWei === BigInt(0)) return BigInt(0);
    return (
      (quoteWei * BigInt(10000 - Math.floor(slippage * 100))) /
      BigInt(10000)
    );
  }, [quoteWei, slippage]);

  // Manual swap function using ethers
  const swap = async () => {
    if (!signer || !canSwap || amountWei === BigInt(0) || minAmountOut === BigInt(0)) {
      const errorMsg = "Cannot swap: Invalid swap parameters";
      setSwapError(errorMsg);
      throw new Error(errorMsg);
    }

    setSwapLoading(true);
    setSwapSuccess(false);
    setSwapError(null);

    try {
      const ammContract = new ethers.Contract(
        AMM_ADDRESS || "",
        SimpleAmmABI.abi,
        signer
      );
      const tx = await ammContract.swap(amountWei, minAmountOut, isAToB);
      console.log("Transaction sent:", tx.hash);
      await tx.wait(); // Wait for transaction confirmation
      console.log("Transaction confirmed:", tx.hash);
      setSwapSuccess(true);
    } catch (err) {
      console.error("Swap failed:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setSwapError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setSwapLoading(false);
    }
  };

  return {
    tokens,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    amount,
    setAmount,
    slippage,
    setSlippage,
    deadline,
    setDeadline,
    canSwap,
    quoteWei,
    minAmountOut,
    swap: signer ? swap : null,
    swapLoading,
    swapSuccess,
    swapError,
  };
} 