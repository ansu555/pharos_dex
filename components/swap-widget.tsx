"use client"

import { useSwapLogic } from "../app/services/swap-logic"
import { ArrowUpDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

type Token = {
  address: string
  symbol: string
  logoURI: string
  decimals: number
}

export default function SwapWidget() {
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
    deadline,
    setDeadline,
    canSwap,
    quoteWei,
    swap,
  } = useSwapLogic() as unknown as {
    tokens: Token[]
    fromToken: string
    setFromToken: (address: string) => void
    toToken: string
    setToToken: (address: string) => void
    amount: string
    setAmount: (amount: string) => void
    slippage: number
    setSlippage: (slippage: number) => void
    deadline: number
    setDeadline: (deadline: number) => void
    canSwap: boolean
    quoteWei: bigint | null
    swap: (() => void) | null
  }

  if (!tokens.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        Loading tokens…
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg mx-auto rounded-2xl border border-border shadow-lg">
        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-popover rounded-full w-fit mx-auto mt-4">
          <Button variant="ghost" className="rounded-full px-6 py-1">
            Swap
          </Button>
          <Button variant="ghost" className="text-muted-foreground rounded-full px-6 py-1">
            Limit
          </Button>
          <Button variant="ghost" className="text-muted-foreground rounded-full px-6 py-1">
            Send
          </Button>
          <Button variant="ghost" className="text-muted-foreground rounded-full px-6 py-1">
            Buy
          </Button>
        </div>

        <CardContent className="space-y-6 px-6 py-8">
          {/* FROM */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              From
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-16 text-2xl flex-1"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="h-16 w-32">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t.address} value={t.address}>
                      <img
                        src={t.logoURI}
                        className="h-5 w-5 rounded-full mr-2"
                      />
                      {t.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SWAP ICON */}
          <div className="flex justify-center -mt-6 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="bg-card border border-border rounded-full w-10 h-10"
              onClick={() => {
                setFromToken(toToken)
                setToToken(fromToken)
              }}
            >
              <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* TO */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Estimated"
                disabled
                className="h-16 text-2xl flex-1 bg-popover"
              />
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="h-16 w-32">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t.address} value={t.address}>
                      <img src={t.logoURI} className="h-5 w-5 rounded-full mr-2" />
                      {t.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced options */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced">
              <AccordionTrigger className="text-sm text-muted-foreground">
                Advanced options
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 bg-popover rounded-lg p-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">Max slippage (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={
                    quoteWei && tokens.length
                      ? (
                          Number(
                            Number(quoteWei) /
                              Math.pow(
                                10,
                                tokens.find((t) => t.address === toToken)?.decimals ?? 18
                              )
                          ).toFixed(4)
                        )
                      : "0.0000"
                  }
                />
                <span className="ml-2">
                  {tokens.find((t) => t.address === toToken)?.symbol}
                </span>
              </div>
                <div className="flex justify-between items-center">
                  <label className="text-sm text-muted-foreground">Deadline (min)</label>
                  <Input
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.valueAsNumber)}
                    className="w-20"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>    
          </Accordion>

          {/* Show estimated */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Estimated Out:</label>
            <div className="text-lg font-semibold">
              {quoteWei
                ? (() => {
                    const decimals = tokens.find((t) => t.address === toToken)?.decimals ?? 18;
                    let divisor = BigInt(1);
                    for (let i = 0; i < decimals; i++) {
                      divisor *= BigInt(10);
                    }
                    return Number(quoteWei / divisor).toFixed(4);
                  })()
                : "0.0000"}{" "}
              {tokens.find((t) => t.address === toToken)?.symbol}
            </div>
          </div>

          {/* Swap button */}
          <Button
            disabled={!swap}
            onClick={() => swap?.()}
            className={`w-full py-4 text-lg rounded-lg ${
              swap
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border text-muted-foreground"
            }`}
          >
            {swap ? "Swap Now" : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}