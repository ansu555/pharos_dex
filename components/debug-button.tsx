"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Code, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGetCryptosQuery, useGetStatsQuery } from "@/app/services/cryptoApi"
import { useGetExchangesQuery } from "@/app/services/exchangeApi"
import { useGetCryptoNewsQuery } from "@/app/services/cryptoNewsApi"

export function DebugButton() {
  const [activeTab, setActiveTab] = useState<string>("crypto")
  const { data: cryptoData } = useGetCryptosQuery(10)
  const { data: statsData } = useGetStatsQuery({})
  const { data: exchangeData } = useGetExchangesQuery(undefined)
  const { data: newsData } = useGetCryptoNewsQuery({ newsCategory: 'cryptocurrency', count: 5 })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const dataSources = {
    crypto: { title: "Crypto API Data", data: cryptoData },
    stats: { title: "Stats API Data", data: statsData },
    exchanges: { title: "Exchange API Data", data: exchangeData },
    news: { title: "News API Data", data: newsData }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full bg-muted hover:bg-muted-foreground/10"
          title="Developer Debug Panel"
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">Debug Data</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>API Debug Data</DialogTitle>
          <DialogDescription>
            View raw API responses for debugging (development environment only)
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.entries(dataSources).map(([key, source]) => (
            <Button 
              key={key}
              variant={activeTab === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(key)}
            >
              {source.title}
            </Button>
          ))}
        </div>
        
        <div className="bg-muted rounded border overflow-hidden">
          <div className="p-4 text-sm flex items-center justify-between cursor-pointer hover:bg-muted-foreground/10"
               onClick={() => toggleSection(activeTab)}>
            <span className="font-medium">{dataSources[activeTab as keyof typeof dataSources].title}</span>
            {expanded[activeTab] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {expanded[activeTab] && (
            <div className="bg-black text-xs p-2 overflow-auto max-h-[60vh]">
              <pre className="text-green-400">
                {JSON.stringify(dataSources[activeTab as keyof typeof dataSources].data, null, 2) || "No data yet"}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}