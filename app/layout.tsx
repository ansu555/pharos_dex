// app/layout.tsx
import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { Fira_Code as FontMono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers as ExistingProviders } from '@/components/providers'
import { SwapProviders } from '@/components/swap-providers'
import { Web3Providers } from '@/components/web3/Web3Providers'
import { ReduxProvider } from '../components/redux-provider'
import { DynamicProviders } from '@/components/dynamic-providers'

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' })
const fontMono = FontMono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans relative`}>
        <ReduxProvider>
          <DynamicProviders>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Web3Providers>
                {children}
              </Web3Providers>
            </ThemeProvider>
          </DynamicProviders>
        </ReduxProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
