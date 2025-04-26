import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketOverview } from "@/components/market-overview"
import { TopCryptocurrencies } from "@/components/top-cryptocurrencies"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <MarketOverview />
        <TopCryptocurrencies />

      </main>
      <Footer />
    </div>
  )
}
