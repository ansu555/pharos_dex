"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectKitButton } from 'connectkit';

export function Header() { 
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Cryptocurrencies", href: "/cryptocurrencies" },
    { name: "Exchanges", href: "/exchanges" },
    { name: "News", href: "/news" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-[#171717]/95 shadow-[0_4px_20px_-4px_rgba(17,60,252,0.25)] dark:shadow-[0_4px_20px_-4px_rgba(243,198,35,0.15)]">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
          
            <div className="font-bold text-xl">
              <span className="text-primary dark:text-[#F3C623]">Crypto</span>
              <span className="dark:text-white">Market</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary dark:hover:text-[#F3C623]",
                  pathname === item.href 
                    ? "text-foreground text-primary dark:text-[#F3C623]" 
                    : "text-muted-foreground text-primary/70 dark:text-[#F3C623]/70",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
        <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress }) => (
              <Button
                onClick={show}
                variant="outline"
                size="default"
              >
                {isConnected ? truncatedAddress : "Connect Wallet"}
              </Button>
            )}
          </ConnectKitButton.Custom>
          {/* <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex dark:text-[#F3C623]/80 dark:hover:text-[#F3C623] dark:hover:bg-[#F3C623]/10"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button> */}
          <ModeToggle />
         
        </div>
      </div>
    </header>
  )
}
