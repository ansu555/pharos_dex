'use client'

import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

export function SwapProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
} 