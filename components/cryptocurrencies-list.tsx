"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArrowDown, ArrowUp, Search, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetCryptosQuery } from "@/app/services/cryptoApi"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
interface Cryptocurrency {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
}

export function CryptocurrenciesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rank")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Get 100 cryptocurrencies from the API
  const { data, isFetching, error, refetch } = useGetCryptosQuery(100);
  
  // For debugging
  console.log('Cryptos API Response:', data);
  
  // Map API data to our component's expected format
  const mapApiDataToCryptos = (apiCoins: any[]): Cryptocurrency[] => {
    if (!apiCoins) return [];
    
    return apiCoins.map(coin => {
      // For debugging
      console.log('Raw coin data:', coin);
      
      return {
        id: coin.uuid || coin.id || '',
        rank: parseInt(coin.rank),
        name: coin.name,
        symbol: coin.symbol,
        price: parseFloat(coin.price),
        // Fix for 1h change - use sparkline data if available or try alternative fields
        change1h: coin.change1h ? parseFloat(coin.change1h) : parseFloat(coin.change) / 24, // Estimate hourly change
        change24h: parseFloat(coin.change),
        // Fix for 7d change - use sparkline data for better estimate if available
        change7d: coin.change7d ? parseFloat(coin.change7d) : 
                 (coin.sparkline && coin.sparkline.length > 0) ? 
                 ((parseFloat(coin.sparkline[coin.sparkline.length-1]) / parseFloat(coin.sparkline[0]) - 1) * 100) : 
                 parseFloat(coin.change) * 7, // Rough estimate
        marketCap: parseInt(coin.marketCap),
        volume24h: parseInt(coin['24hVolume'] || '0'),
        circulatingSupply: parseInt(coin.supply?.circulating || '0'),
      };
    });
  };
  
  // Convert API data to our format
  const allCryptos = data ? mapApiDataToCryptos(data.coins) : [];

  // Filter and sort cryptos
  const filteredCryptos = allCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedCryptos = [...filteredCryptos].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a]
    const bValue = b[sortBy as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedCryptos.length / itemsPerPage)
  const paginatedCryptos = sortedCryptos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value)
              setSortOrder("asc")
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="change24h">24h Change</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume24h">Volume (24h)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center p-12 border rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-red-500">Error loading cryptocurrency data</h3>
          <p className="text-muted-foreground mb-4">There was a problem fetching the cryptocurrency list.</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : isFetching ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("rank")}>
                      Rank
                      {sortBy === "rank" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Name
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("price")}>
                      Price
                      {sortBy === "price" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("change1h")}>
                      1h %
                      {sortBy === "change1h" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("change24h")}>
                      24h %
                      {sortBy === "change24h" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("change7d")}>
                      7d %
                      {sortBy === "change7d" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("marketCap")}>
                      Market Cap
                      {sortBy === "marketCap" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right hidden lg:table-cell">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("volume24h")}>
                      Volume (24h)
                      {sortBy === "volume24h" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="ml-1 h-3 w-3 inline" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3 inline" />
                        ))}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCryptos.length > 0 ? (
                  paginatedCryptos.map((crypto) => (
                    <TableRow key={crypto.id} className="hover:bg-muted/50 dark:hover:bg-[#F3C623]/10">
                      <TableCell className="font-medium">{crypto.rank}</TableCell>
                      <TableCell>
                        <Link
                          href={`/cryptocurrencies/${crypto.id}`}
                          className="flex items-center hover:text-primary dark:hover:text-[#F3C623] transition-colors"
                        >
                          <div className="w-8 h-8 bg-[#113CFC]/10 dark:bg-[#F3C623]/10 rounded-full mr-3 flex items-center justify-center text-xs font-mono text-[#113CFC] dark:text-[#F3C623]">
  {crypto.symbol.substring(0, 3)}
</div>
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-xs text-muted-foreground dark:text-[#F3C623]/60">{crypto.symbol}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className={cn(
  "text-right", 
  crypto.change1h >= 0 
    ? "text-green-500 dark:text-[#F3C623]" 
    : "text-red-500"
)}>

                        <div className="flex items-center justify-end">
                          {crypto.change1h >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(crypto.change1h).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className={cn(
  "text-right", 
  crypto.change24h >= 0 
    ? "text-green-500 dark:text-[#F3C623]" 
    : "text-red-500"
)}>

                        <div className="flex items-center justify-end">
                          {crypto.change24h >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(crypto.change24h).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className={cn(
  "text-right hidden md:table-cell",
  crypto.change7d >= 0 
    ? "text-green-500 dark:text-[#F3C623]" 
    : "text-red-500"
)}>

                        <div className="flex items-center justify-end">
                          {crypto.change7d >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(crypto.change7d).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        ${(crypto.marketCap / 1000000000).toFixed(1)}B
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        ${(crypto.volume24h / 1000000000).toFixed(1)}B
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No cryptocurrencies found. Try a different search term.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i

                if (pageNumber <= 0 || pageNumber > totalPages) return null

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(pageNumber)
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
      
      {/* Debug panel - only shown in development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded border text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Debug API Response</summary>
            <pre className="mt-2 p-2 bg-black text-green-400 overflow-auto max-h-[400px]">
              {JSON.stringify(data, null, 2) || "No data yet"}
            </pre>
          </details>
        </div>
      )} */}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">1h %</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right hidden md:table-cell">7d %</TableHead>
            <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Volume (24h)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
              <TableCell className="text-right hidden md:table-cell"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
              <TableCell className="text-right hidden md:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              <TableCell className="text-right hidden lg:table-cell"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
