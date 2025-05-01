// app/layout.tsx

import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { Fira_Code as FontMono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import BackgroundPaths from '@/components/animated-background';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers as ExistingProviders } from '@/components/providers';
import { Web3Providers } from '../components/web3/Web3Providers'
// ← NEW imports:
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config as wagmiConfig } from './services/wallet/connectWeb3';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = FontMono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono' });

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans relative`}>
        {/* 1️⃣ Wagmi */}
        <WagmiConfig config={wagmiConfig}>
          {/* 2️⃣ React-Query */}
          <QueryClientProvider client={queryClient}>
            {/* 3️⃣ ConnectKit */}
            <ConnectKitProvider
              mode="light"
              customTheme={{
                '--ck-font-family': 'Inter, sans-serif',
                '--ck-border-radius': '8px',
                '--ck-background': '#f5f5f5',
              }}
              options={{
                embedGoogleFonts: true,
              }}
            >
              {/* your existing app providers */}
              <ExistingProviders>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <BackgroundPaths />
                  {/* ← here: */}
          <Web3Providers>
            {children}
          </Web3Providers>
                  
                </ThemeProvider>
              </ExistingProviders>
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiConfig>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
