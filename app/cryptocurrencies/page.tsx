import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CryptocurrenciesList } from "@/components/cryptocurrencies-list"
import BackgroundPaths from "@/components/animated-background"

export default function CryptocurrenciesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundPaths />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Cryptocurrencies</h1>
        <CryptocurrenciesList />
      </main>
      <Footer />
    </div>
  )
}
