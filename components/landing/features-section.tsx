"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  FileText,
  Bell,
  Settings,
  Zap,
  Shield,
  TrendingUp,
  Activity,
} from "lucide-react"
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal"

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Powerful data analysis tools with real-time visualization and insights",
    badge: "Popular",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Complete control over users with advanced access permissions",
    badge: null,
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description: "Automated report generation with customizable templates",
    badge: "New",
  },
  {
    icon: Activity,
    title: "Activity Logs",
    description: "Detailed tracking of all user actions within the system",
    badge: null,
  },
  {
    icon: Zap,
    title: "API Integrations",
    description: "Connect external services via REST API and webhooks",
    badge: null,
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Customizable notifications for important system events",
    badge: null,
  },
  {
    icon: Shield,
    title: "Security",
    description: "Multi-layer data protection with encryption and RLS policies",
    badge: "Secure",
  },
  {
    icon: TrendingUp,
    title: "Forecasting",
    description: "AI-powered analysis for trend prediction and forecasting",
    badge: null,
  },
  {
    icon: Settings,
    title: "Flexible Settings",
    description: "Full customization to meet your business needs",
    badge: null,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need for analytics management
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Powerful toolkit for efficient data and analytics management
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollRevealItem key={index} type="fadeUp" duration={0.6}>
                <SpotlightCard className="h-full">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                    <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-primary/10 shrink-0">
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                      <CardDescription className="text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </ScrollRevealItem>
            )
          })}
        </ScrollRevealContainer>
      </div>
    </section>
  )
}
