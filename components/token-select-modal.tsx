"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  address: string;
  decimals: number;
  chainId: number;
}

interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken?: Token | null;
}

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tokens from Uniswap list
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("https://tokens.uniswap.org");
        const data = await response.json();
        // Filter for Ethereum mainnet tokens (chainId: 1)
        const mainnetTokens = data.tokens.filter((token: Token) => token.chainId === 1);
        setTokens(mainnetTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTokens();
    }
  }, [isOpen]);

  const filteredTokens = tokens.filter(
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              Loading tokens...
            </div>
          ) : (
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
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      // Fallback image if token logo fails to load
                      e.currentTarget.src = "/tokens/fallback.png";
                    }}
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
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 