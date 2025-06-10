"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Settings, ArrowDownUp, ChevronDown, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TokenSelectModal } from "@/components/token-select-modal"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SparklesCore } from "@/components/background2/sparkles"
import { FloatingPaper } from "@/components/background2/floating-paper"
import { useTheme } from "next-themes"
import { useSwapLogic } from "@/app/services/swap-logic"
import { formatUnits } from "ethers/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Token {
  symbol: string
  name: string
  logo: string
  address: string
  decimals: number
}

interface TokenListToken {
  symbol: string
  name: string
  logoURI?: string
  address: string
  decimals: number
  chainId: number
}

const SwapPage = () => {
  const { theme } = useTheme()
  const { toast } = useToast()
  const {
    tokens,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    amount,
    setAmount,
    slippage,
    setSlippage,
    canSwap,
    quoteWei,
    minAmountOut,
    swap,
    swapLoading,
    swapSuccess,
    swapError,
  } = useSwapLogic()

  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState(false)
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedFromToken, setSelectedFromToken] = useState<Token | null>(null)
  const [selectedToToken, setSelectedToToken] = useState<Token | null>(null)

  // Update selected tokens when fromToken/toToken changes
  useEffect(() => {
    if (fromToken && tokens.length > 0) {
      const token = (tokens as TokenListToken[]).find(t => t.address === fromToken)
      if (token) {
        setSelectedFromToken({
          symbol: token.symbol,
          name: token.name,
          logo: token.logoURI || "/tokens/default.png",
          address: token.address,
          decimals: token.decimals
        })
      }
    }
    if (toToken && tokens.length > 0) {
      const token = (tokens as TokenListToken[]).find(t => t.address === toToken)
      if (token) {
        setSelectedToToken({
          symbol: token.symbol,
          name: token.name,
          logo: token.logoURI || "/tokens/default.png",
          address: token.address,
          decimals: token.decimals
        })
      }
    }
  }, [fromToken, toToken, tokens])

  const handleTokenSelect = (token: Token, isFrom: boolean) => {
    if (isFrom) {
      setFromToken(token.address)
      setSelectedFromToken(token)
    } else {
      setToToken(token.address)
      setSelectedToToken(token)
    }
  }

  const handleSwapTokens = () => {
    const tempFrom = fromToken
    const tempTo = toToken
    setFromToken(tempTo)
    setToToken(tempFrom)
    setAmount("")
  }

  const handleSwap = async () => {
    if (!swap) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform swaps",
        variant: "destructive",
      })
      return
    }

    try {
      await swap()
      if (swapSuccess) {
        toast({
          title: "Swap successful!",
          description: "Your tokens have been swapped successfully",
        })
      }
    } catch (error) {
      console.error("Swap error:", error)
    }
  }

  // Format quote for display
  const formattedQuote = selectedToToken && quoteWei > BigInt(0)
    ? formatUnits(quoteWei, selectedToToken.decimals)
    : "0.0"

  // Calculate price impact (simplified)
  const priceImpact = selectedFromToken && selectedToToken && amount && formattedQuote !== "0.0"
    ? ((Number(formattedQuote) / Number(amount)) * 100).toFixed(2)
    : "0.00"

  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Background layers */}
      <div className="fixed inset-0 -z-10">
        <SparklesCore
          id="sparkles"
          background="transparent"
          particleColor={theme === "dark" ? "#F3C623" : "#113CFC"}
          particleDensity={90}
          className="w-full h-full"
        />
        <div className="absolute inset-0 pointer-events-none">
          <FloatingPaper count={10} />
        </div>
      </div>

      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-6 bg-card border-border max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Swap</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* From Token Input */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="text-sm text-muted-foreground">Balance: 0.0</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl bg-background"
                disabled={swapLoading}
              />
              <Button
                variant="outline"
                className="min-w-[120px]"
                onClick={() => setIsFromTokenModalOpen(true)}
                disabled={swapLoading}
              >
                {selectedFromToken ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedFromToken.logo}
                      alt={selectedFromToken.symbol}
                      className="w-6 h-6"
                    />
                    <span>{selectedFromToken.symbol}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Select Token</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-muted hover:bg-muted/80"
              onClick={handleSwapTokens}
              disabled={swapLoading}
            >
              <ArrowDownUp className="h-5 w-5" />
            </Button>
          </div>

          {/* To Token Input */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="text-sm text-muted-foreground">Balance: 0.0</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.0"
                value={formattedQuote}
                readOnly
                className="text-2xl bg-background"
              />
              <Button
                variant="outline"
                className="min-w-[120px]"
                onClick={() => setIsToTokenModalOpen(true)}
                disabled={swapLoading}
              >
                {selectedToToken ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedToToken.logo}
                      alt={selectedToToken.symbol}
                      className="w-6 h-6"
                    />
                    <span>{selectedToToken.symbol}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Select Token</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Price Information */}
          <div className="space-y-2 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="text-foreground">
                {amount && formattedQuote !== "0.0"
                  ? `1 ${selectedFromToken?.symbol} = ${(Number(formattedQuote) / Number(amount)).toFixed(6)} ${selectedToToken?.symbol}`
                  : "0.0"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="text-foreground">{priceImpact}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <Select value={slippage.toString()} onValueChange={(value) => setSlippage(Number(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{slippage}%</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1%</SelectItem>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1.0">1.0%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Alert */}
          {swapError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {swapError || "An error occurred during the swap"}
              </AlertDescription>
            </Alert>
          )}

          {/* Swap Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            onClick={handleSwap}
            disabled={!canSwap || swapLoading}
          >
            {swapLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : !selectedFromToken || !selectedToToken ? (
              "Select Tokens"
            ) : !amount ? (
              "Enter Amount"
            ) : (
              "Swap"
            )}
          </Button>
        </Card>
      </main>

      <Footer />

      {/* Token Selection Modals */}
      <TokenSelectModal
        isOpen={isFromTokenModalOpen}
        onClose={() => setIsFromTokenModalOpen(false)}
        onSelect={(token) => handleTokenSelect(token, true)}
        selectedToken={selectedFromToken}
        tokens={(tokens as TokenListToken[]).map(t => ({
          symbol: t.symbol,
          name: t.name,
          logo: t.logoURI || "/tokens/default.png",
          address: t.address,
          decimals: t.decimals
        }))}
      />
      <TokenSelectModal
        isOpen={isToTokenModalOpen}
        onClose={() => setIsToTokenModalOpen(false)}
        onSelect={(token) => handleTokenSelect(token, false)}
        selectedToken={selectedToToken}
        tokens={(tokens as TokenListToken[]).map(t => ({
          symbol: t.symbol,
          name: t.name,
          logo: t.logoURI || "/tokens/default.png",
          address: t.address,
          decimals: t.decimals
        }))}
      />
    </div>
  )
}

export default SwapPage