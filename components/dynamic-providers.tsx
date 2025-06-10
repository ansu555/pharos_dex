'use client'

import { usePathname } from 'next/navigation'
import { Providers as ExistingProviders } from './providers'
import { SwapProviders } from './swap-providers'

export function DynamicProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Use SwapProviders for the swap page, ExistingProviders for other pages
  const Provider = pathname === '/swap' ? SwapProviders : ExistingProviders

  return (
    <Provider>
      {children}
    </Provider>
  )
} 