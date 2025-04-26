import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsList } from "@/components/news-list"

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Cryptocurrency News</h1>
        <NewsList />
      </main>
      <Footer />
    </div>
  )
}
