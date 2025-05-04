import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExchangesList } from "@/components/exchanges-list"
import BackgroundPaths from "@/components/animated-background"

export default function ExchangesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPaths />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Cryptocurrency Exchanges</h1>
        <ExchangesList />
      </main>
      <Footer />
    </div>
  )
}
