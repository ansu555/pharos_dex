import { useState, useEffect, useMemo } from "react";
import { ethers, parseUnits, formatUnits } from "ethers"; // Import ethers
import SimpleAmmABI from "@/app/abis/SimpleAmm.json";

const AMM_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS;

export function useSwapLogic() {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapError, setSwapError] = useState(null);
  const [quoteWei, setQuoteWei] = useState(0n); // Need state for quote

  // load token list
  useEffect(() => {
    fetch("https://tokens.uniswap.org")
      .then((r) => r.json())
      .then((j) => {
        // Filter for Ethereum mainnet tokens (chainId: 1)
        const evm1 = j.tokens.filter((t) => t.chainId === 1);
        setTokens(evm1);
        if (evm1.length >= 2) {
          setFromToken(evm1[0].address);
          setToToken(evm1[1].address);
        }
      })
      .catch((error) => {
        console.error("Error fetching token list:", error);
      });
  }, []);

  // Effect to connect to wallet and get provider/signer
  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          const web3Signer = await web3Provider.getSigner();
          setSigner(web3Signer);
        } catch (err) {
          console.error("Failed to connect wallet:", err);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };
    connectWallet();
    // Add listeners for account/chain changes if needed
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
      return 0n;
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
      if (provider && canSwap && amountWei > 0n) {
        try {
          const ammContract = new ethers.Contract(
            AMM_ADDRESS,
            SimpleAmmABI.abi,
            provider
          );
          const rawQuote = await ammContract.getAmountOut(amountWei, isAToB);
          setQuoteWei(rawQuote);
        } catch (err) {
          console.error("Failed to fetch quote:", err);
          setQuoteWei(0n);
        }
      } else {
        setQuoteWei(0n);
      }
    };
    fetchQuote();
  }, [provider, canSwap, amountWei, isAToB]); // Dependencies for quote

  // apply slippage
  const minAmountOut = useMemo(() => {
    if (quoteWei === 0n) return 0n;
    return (
      (quoteWei * BigInt(10000 - Math.floor(slippage * 100))) /
      10000n
    );
  }, [quoteWei, slippage]);

  // Manual swap function using ethers
  const swap = async () => {
    if (!signer || !canSwap || amountWei <= 0n || minAmountOut <= 0n) {
      console.error("Cannot swap", {
        signer,
        canSwap,
        amountWei,
        minAmountOut,
      });
      return;
    }

    setSwapLoading(true);
    setSwapSuccess(false);
    setSwapError(null);

    try {
      const ammContract = new ethers.Contract(
        AMM_ADDRESS,
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
      setSwapError(err);
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
    quoteWei, // Return the state variable
    minAmountOut,
    swap: signer ? swap : null, // Only enable swap if signer exists
    swapLoading,
    swapSuccess,
    swapError,
  };
}