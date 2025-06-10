"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Token {
  symbol: string;
  name: string;
  logo: string;
  address: string;
}

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token | null;
}

// Mock tokens - replace with your actual token list
const MOCK_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    logo: "/tokens/eth.png",
    address: "0x...",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/tokens/usdc.png",
    address: "0x...",
  },
  // Add more tokens as needed
];

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = MOCK_TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Select a token
          </DialogTitle>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <ScrollArea className="h-[300px] mt-4">
          <div className="space-y-2">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                  selectedToken?.address === token.address ? "bg-muted" : ""
                }`}
              >
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">
                    {token.symbol}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {token.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 