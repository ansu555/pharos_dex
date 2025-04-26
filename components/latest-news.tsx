"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Loader2 } from "lucide-react"
import { useGetCryptoNewsQuery } from "@/app/services/cryptoNewsApi"

export function LatestNews() {
  const { data: newsData, isLoading, error } = useGetCryptoNewsQuery({ 
    newsCategory: 'cryptocurrency', 
    count: 3 
  });

  // Show loading state
  if (isLoading) {
    return (
      <section className="mb-10 flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Latest News</h2>
        <p className="text-red-500">Failed to load latest crypto news. Please try again later.</p>
      </section>
    );
  }

  // Get the first 3 articles
  const latestNews = newsData?.articles?.slice(0, 3) || [];

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Latest News</h2>
      {latestNews.length === 0 ? (
        <p>No news articles available at the moment.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((article: {
              id: string;
              title: string;
              imageUrl?: string;
              source: string;
              date: string;
              snippet: string;
              url: string;
            }) => (
              <Card key={article.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
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
                  <p className="text-sm text-muted-foreground line-clamp-3">{article.snippet}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      Read more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/news">
                View All News
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
