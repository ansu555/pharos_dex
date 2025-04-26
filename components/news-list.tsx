"use client"

import { useState, useEffect, Key, ReactElement, ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ExternalLink, Search, Loader2 } from "lucide-react"
import { useGetCryptoNewsQuery } from "@/app/services/cryptoNewsApi"
import { UrlObject } from "url"

export function NewsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const itemsPerPage = 9
  
  // Fetch news data with a larger count to support pagination and filtering
  const { data: newsData, isLoading, error } = useGetCryptoNewsQuery({ 
    newsCategory: 'cryptocurrency', 
    count: 100 
  });
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, searchTerm]);
  
  // Define these variables outside of any conditional returns
  const allNews = newsData?.articles || [];
  
  // Get all unique tags
  const allTags = Array.from(new Set(allNews.flatMap((article: { tags: any }) => article.tags)));

  // Filter news
  const filteredNews = allNews.filter(
    (article: { title: string; snippet: string; source: string; tags: string | string[] }) =>
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTag === null || article.tags.includes(selectedTag)),
  )

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div>
        <p className="text-red-500">Failed to load crypto news. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedTag === null ? "default" : "outline"} 
              size="sm" 
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag as string}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag as string)}
              >
                {tag as string}
              </Button>
            ))}
          </div>
        )}
      </div>

      {paginatedNews.length === 0 ? (
        <p className="text-center py-8">No articles match your search criteria.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedNews.map((article: { id: Key | null | undefined; imageUrl: any; title: string | number | boolean | ReactElement<any, string> | Iterable<ReactNode> | null | undefined; source: string | number | boolean | ReactElement<any, string> | Iterable<ReactNode> | null | undefined; date: string | number | boolean | ReactElement<any, string> | Iterable<ReactNode> | null | undefined; snippet: string | number | boolean | ReactElement<any, string> | Iterable<ReactNode> | null | undefined; tags: any[]; url: string | UrlObject }) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image 
                    src={article.imageUrl || "/placeholder.svg"} 
                    alt={typeof article.title === 'string' ? article.title : String(article.title || 'Article image')} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <span className="font-medium">{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{article.date}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{article.snippet}</p>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Button
                          key={tag as string}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setSelectedTag(tag as string)}
                        >
                          {tag as string}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      Read full article
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
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
          )}
        </>
      )}
    </div>
  )
}
