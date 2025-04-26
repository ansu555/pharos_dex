import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ExchangeDetail } from "@/components/exchange-detail"

export default function ExchangeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <ExchangeDetail id={params.id} />
      </main>
      <Footer />
    </div>
  )
}
