import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { Fira_Code as FontMono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import BackgroundPaths from "@/components/animated-background";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/providers";
import { SpeedInsights } from "@vercel/speed-insights/next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans relative`}
        suppressHydrationWarning
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <BackgroundPaths />
            {children}
          </ThemeProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
