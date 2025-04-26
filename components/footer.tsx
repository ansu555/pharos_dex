import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { DebugButton } from "@/components/debug-button"

export function Footer() {
  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-[#171717]/95 shadow-[0_-4px_20px_-4px_rgba(17,60,252,0.25)] dark:shadow-[0_-4px_20px_-4px_rgba(243,198,35,0.15)]">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-bold text-lg">
            <span className="text-primary dark:text-[#F3C623]">Crypto</span>
            <span className="dark:text-white">Market</span>
          </div>
          <p className="text-xs text-muted-foreground dark:text-[#F3C623]/60 ml-4 hidden md:block">
            © {new Date().getFullYear()} CryptoMarket. All rights reserved.
          </p>
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            About
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex gap-4 items-center">
          <Link href="https://x.com/Dev_anik2003" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://github.com/ansu555/crypto-market" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/anikdas2003/" className="text-muted-foreground hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623] transition-colors">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <DebugButton />
        </div>
      </div>
    </footer>
  )
}
