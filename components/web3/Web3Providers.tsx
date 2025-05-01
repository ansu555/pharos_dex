// components/web3/Web3Providers.tsx
'use client'

import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config as wagmiConfig } from '@/app/services/wallet/connectWeb3'

const queryClient = new QueryClient()

export function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="light"
          customTheme={{
            '--ck-font-family': 'Inter, sans-serif',
            '--ck-border-radius': '8px',
            '--ck-background': '#f5f5f5',
          }}
          options={{ embedGoogleFonts: true }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
