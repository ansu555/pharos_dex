"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectKitButton } from 'connectkit';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Cryptocurrencies", href: "/cryptocurrencies" },
    { name: "Exchanges", href: "/exchanges" },
    { name: "News", href: "/news" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur dark:bg-[#171717]/95 shadow">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          {/* Logo can go here */}
          <Link href="/" className="font-bold text-lg">
            PharosDEX
          </Link>
          {/* Navigation links */}
          <nav className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary dark:text-[#F3C623] underline"
                    : "text-gray-700 hover:text-primary dark:text-[#F3C623]/60 dark:hover:text-[#F3C623]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* ← Connect Wallet button */}
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

          {/* your other controls */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
