"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { ArrowRight, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { motion } from "framer-motion"
import Link from "next/link"
import Hyperspeed from "@/components/Hyperspeed"

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="scale" duration={0.8} distance={0}>
          <SpotlightCard>
            <Card className="border-2 border-primary/50 shadow-2xl relative overflow-hidden">
              {/* Hyperspeed Background - only for card */}
              <div className="absolute inset-0 z-0 w-full h-full bg-black rounded-lg overflow-hidden">
                <div className="w-full h-full">
                  <Hyperspeed
                  effectOptions={{
                    colors: {
                      roadColor: 0x080808,
                      islandColor: 0x0a0a0a,
                      background: 0x000000,
                      shoulderLines: 0xffffff,
                      brokenLines: 0xffffff,
                      leftCars: [0xff00ff, 0xff1493, 0xff69b4], // Bright pink-purple
                      rightCars: [0x00ffff, 0x00bfff, 0x0080ff], // Bright cyan-blue
                      sticks: 0x00ffff, // Bright cyan
                    },
                    lightPairsPerRoadWay: 50, // More cars
                    totalSideLightSticks: 30, // More sticks
                    speedUp: 3, // Faster on hover
                    fovSpeedUp: 160, // More speed effect
                    bloomIntensity: 2.5, // Enhanced glow
                    bloomThreshold: 0.1, // Lower threshold = more glow
                    bloomSmoothing: 0.5, // Smooth glow
                  }}
                  />
                </div>
              </div>

              <CardContent className="pt-12 pb-12 px-4 sm:px-6 lg:px-12 relative z-10">
              <div className="text-center space-y-8 max-w-3xl mx-auto">
                <ScrollReveal type="fadeUp" duration={0.6} delay={0.1} className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-4">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">Ready to start?</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                    Start free today
                  </h2>

                  <p className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed px-4">
                    Join thousands of companies already using Analytics Pro to improve their analytics
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4">
                    <Button
                      size="lg"
                      className="text-base sm:text-lg px-6 sm:px-8 py-3 h-auto w-full sm:w-auto group"
                      asChild
                    >
                      <Link href="/register">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base sm:text-lg px-6 sm:px-8 py-3 h-auto w-full sm:w-auto border-white/20 text-black bg-white/90 hover:bg-white"
                      asChild
                    >
                      <Link href="#pricing">View pricing</Link>
                    </Button>
                  </div>

                  <p className="text-xs sm:text-sm text-white/60 pt-4">
                    No credit card required • Cancel anytime • 14-day free trial
                  </p>
                </ScrollReveal>
              </div>
            </CardContent>
          </Card>
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
