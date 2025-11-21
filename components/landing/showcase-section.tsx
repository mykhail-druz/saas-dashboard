"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ArrowRight,
} from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import Link from "next/link"

const showcases = [
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description:
      "Powerful data visualization tools with detailed analysis capabilities",
    features: ["Real-time updates", "PDF export", "Customizable dashboards"],
    color: "#5227FF",
    imageBase: "interactive-charts",
    alt: "Dashboard with interactive charts showing revenue trends, traffic overview, top users, and category distribution",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Automatic trend detection and forecasting of future metrics",
    features: ["AI forecasting", "Historical data", "Trend visualization"],
    color: "#7cff67",
    imageBase: "trend-analysis",
    alt: "Dashboard showing trend analysis with revenue trends, traffic overview, and KPI metrics",
  },
  {
    icon: PieChart,
    title: "Detailed Analytics",
    description:
      "Deep data analysis with multiple metrics and dimensions",
    features: ["Data segmentation", "Comparative analysis", "Cohort analysis"],
    color: "#5227FF",
    imageBase: "detailed-analytics",
    alt: "Reports page with detailed analytics showing comprehensive data analysis and metrics",
  },
]

interface ShowcaseImageProps {
  showcase: (typeof showcases)[number]
  index: number
}

function ShowcaseImage({ showcase, index }: ShowcaseImageProps) {
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const Icon = showcase.icon

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Determine which theme to use (resolvedTheme handles system theme)
  // Use "light" as default before mounting to prevent hydration mismatch
  const currentTheme = mounted ? (resolvedTheme || theme || "light") : "light"
  const isDark = currentTheme === "dark"
  const imagePath = `/showcase/${showcase.imageBase}-${isDark ? "dark" : "light"}.png`

  // Fallback to placeholder if image fails to load or doesn't exist
  if (imageError) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-colors duration-300 shadow-lg">
        <div 
          className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center p-6 sm:p-8"
          style={{
            background: `linear-gradient(135deg, ${showcase.color}15 0%, ${showcase.color}05 50%, hsl(var(--muted)) 100%)`
          }}
        >
          <div className="text-center space-y-4">
            <div
              className="mx-auto p-4 sm:p-6 rounded-xl w-fit shadow-lg"
              style={{
                background: `${showcase.color}20`,
                color: showcase.color,
              }}
            >
              <Icon className="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted-foreground/20 rounded-full w-40 sm:w-48 mx-auto" />
              <div className="h-2 bg-muted-foreground/10 rounded-full w-32 sm:w-40 mx-auto" />
              <div className="h-2 bg-muted-foreground/10 rounded-full w-36 sm:w-44 mx-auto" />
            </div>
          </div>
        </div>
        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${showcase.color}10 0%, transparent 70%)`
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-colors duration-300 shadow-lg">
      <div className="aspect-video relative bg-muted rounded-2xl">
        <Image
          key={imagePath}
          src={imagePath}
          alt={showcase.alt}
          fill
          className="object-cover rounded-2xl"
          onError={() => setImageError(true)}
          loading={index === 0 ? "eager" : "lazy"}
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          suppressHydrationWarning
        />
      </div>
      {/* Subtle glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${showcase.color}10 0%, transparent 70%)`
        }}
      />
    </div>
  )
}

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-16 sm:py-20 lg:py-24 bg-background overflow-x-hidden w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full overflow-x-hidden">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            See capabilities in action
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            See how our tools will help you make informed decisions
          </p>
        </ScrollReveal>

        <div className="space-y-12 sm:space-y-16">
          {showcases.map((showcase, index) => {
            const Icon = showcase.icon
            const isEven = index % 2 === 0
            return (
              <ScrollReveal
                key={index}
                type={isEven ? "fadeLeft" : "fadeRight"}
                duration={0.8}
                distance={60}
                delay={index * 0.1}
              >
                <div
                  className={`flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-6 sm:gap-8 w-full`}
                >
                  <div className="flex-1 w-full">
                    <SpotlightCard className="h-full">
                      <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2">
                        <CardHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="p-3 sm:p-4 rounded-xl"
                              style={{
                                background: `${showcase.color}20`,
                                color: showcase.color,
                              }}
                            >
                              <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <CardTitle className="text-xl sm:text-2xl">{showcase.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {showcase.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 mb-6">
                            {showcase.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-3">
                                <div
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ background: showcase.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <Button variant="outline" className="w-full sm:w-auto" asChild>
                            <Link href="/register">
                              Try free
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </SpotlightCard>
                  </div>

                  <div className="flex-1 w-full">
                    <ShowcaseImage showcase={showcase} index={index} />
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
