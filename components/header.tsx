"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ConnectKitButton } from "connectkit";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { KycVerification } from "@/components/web3/KYC_verification";

export function Header() {
  const pathname = usePathname();
  const { address: userAddress, isConnected } = useAccount();
  const kycRegistry = process.env.NEXT_PUBLIC_KYC_REGISTRY_ADDRESS!;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Cryptocurrencies", href: "/cryptocurrencies" },
    { name: "Exchanges", href: "/exchanges" },
    { name: "News", href: "/news" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur dark:bg-[#171717]/95 shadow">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-lg">
            PharosDEX
          </Link>
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

        {/* Wallet connect, KYC, and mode toggle */}
        <div className="flex items-center gap-2">
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress }) => (
              <Button onClick={show} variant="outline" size="default">
                {isConnected ? truncatedAddress : "Connect Wallet"}
              </Button>
            )}
          </ConnectKitButton.Custom>

          {isConnected && userAddress && (
            <KycVerification
              contractAddress={kycRegistry}
              userAddress={userAddress}
            />
          )}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
