"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Settings, ArrowDownUp, ChevronDown } from "lucide-react"
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

interface Token {
  symbol: string
  name: string
  logoURI: string
  address: string
  decimals: number
  chainId: number
}

const SwapPage = () => {
  const { theme } = useTheme()
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState(false)
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSwap = () => {
    // Implement swap logic here
    console.log("Swapping tokens...")
  }

  const handleTokenSelect = (token: Token, isFrom: boolean) => {
    if (isFrom) {
      setFromToken(token)
    } else {
      setToToken(token)
    }
  }

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

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
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="text-2xl bg-background"
              />
              <Button
                variant="outline"
                className="min-w-[120px]"
                onClick={() => setIsFromTokenModalOpen(true)}
              >
                {fromToken ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={fromToken.logoURI}
                      alt={fromToken.symbol}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = "/tokens/fallback.png";
                      }}
                    />
                    <span>{fromToken.symbol}</span>
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
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="text-2xl bg-background"
              />
              <Button
                variant="outline"
                className="min-w-[120px]"
                onClick={() => setIsToTokenModalOpen(true)}
              >
                {toToken ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={toToken.logoURI}
                      alt={toToken.symbol}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = "/tokens/fallback.png";
                      }}
                    />
                    <span>{toToken.symbol}</span>
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
              <span className="text-foreground">0.0 USD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <Select value={slippage} onValueChange={setSlippage}>
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

          {/* Swap Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            onClick={handleSwap}
            disabled={!fromToken || !toToken || !fromAmount || !toAmount}
          >
            {!fromToken || !toToken
              ? "Select Tokens"
              : !fromAmount || !toAmount
              ? "Enter Amount"
              : "Swap"}
          </Button>
        </Card>
      </main>

      <Footer />

      {/* Token Selection Modals */}
      <TokenSelectModal
        isOpen={isFromTokenModalOpen}
        onClose={() => setIsFromTokenModalOpen(false)}
        onSelect={(token) => handleTokenSelect(token, true)}
        selectedToken={fromToken}
      />
      <TokenSelectModal
        isOpen={isToTokenModalOpen}
        onClose={() => setIsToTokenModalOpen(false)}
        onSelect={(token) => handleTokenSelect(token, false)}
        selectedToken={toToken}
      />
    </div>
  )
}

export default SwapPage