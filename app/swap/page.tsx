"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SparklesCore } from "@/components/background2/sparkles"
import { FloatingPaper } from "@/components/background2/floating-paper"
import { useMousePosition } from "@/hooks/use-mouse-position"
import { useRef, useEffect } from "react"

export default function SwapPage() {
  // Check if any BackgroundPaths component might be added from elsewhere
  const pageRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Remove any animated-background elements that might be injected from other components
    if (pageRef.current) {
      const existingBackgrounds = document.querySelectorAll('[data-background-paths]')
      existingBackgrounds.forEach(elem => {
        elem.remove()
      })
    }
  }, [])
  
  return (
    <div ref={pageRef} className="flex min-h-screen flex-col relative">
      {/* Layered background animations */}
      <div className="fixed inset-0 -z-10">
        {/* Base sparkles layer */}
        <SparklesCore
          id="sparkles"
          background="transparent"
          particleColor="var(--primary)" 
          particleDensity={100}
          className="w-full h-full"
        />
        
        {/* Floating papers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingPaper count={4} />
        </div>
      </div>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center backdrop-blur-sm bg-background/30 px-6 py-3 rounded-lg">
          Swap
        </h1>
      </main>
      
      <Footer />
    </div>
  )
}