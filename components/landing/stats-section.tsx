"use client"

import { Card, CardContent } from "@/components/ui/card"
import CountUp from "@/components/CountUp"
import { TrendingUp, Users, FileText, Zap } from "lucide-react"
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal"

const stats = [
  {
    icon: Users,
    label: "Active users",
    value: 10000,
    suffix: "+",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileText,
    label: "Reports created",
    value: 50000,
    suffix: "+",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    label: "Requests per second",
    value: 2500,
    suffix: "+",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: TrendingUp,
    label: "Performance increase",
    value: 98,
    suffix: "%",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            The numbers speak for themselves
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            We've helped thousands of companies improve their analytics
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollRevealItem key={index} type="scale" duration={0.6}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                  <CardContent className="pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6 px-3 sm:px-4">
                    <div
                      className={`inline-flex p-2 sm:p-3 md:p-4 rounded-full ${stat.bgColor} mb-2 sm:mb-3 md:mb-4`}
                    >
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                        <CountUp to={stat.value} duration={2.5} separator="," />
                        <span className="text-primary">{stat.suffix}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollRevealItem>
            )
          })}
        </ScrollRevealContainer>
      </div>
    </section>
  )
}
