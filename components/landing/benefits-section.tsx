"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Check } from "lucide-react"
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal"

const benefits = [
  {
    title: "Time Savings",
    description:
      "Automate routine tasks and focus on what matters most",
    points: [
      "Automated report generation",
      "Ready-made analytics templates",
      "Integration with popular services",
    ],
  },
  {
    title: "Improved Accuracy",
    description: "Eliminate human errors with automation",
    points: [
      "Real-time data validation",
      "Automatic verification",
      "Backup solutions",
    ],
  },
  {
    title: "Scalability",
    description: "Grow without limits alongside your business",
    points: [
      "Unlimited users",
      "Flexible architecture",
      "High performance",
    ],
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Why choose us
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Benefits that will help you achieve more
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <ScrollRevealItem key={index} type={index % 2 === 0 ? "fadeLeft" : "fadeRight"} duration={0.7} distance={40}>
              <SpotlightCard className="h-full">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                  <CardContent className="pt-4 sm:pt-5 md:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{benefit.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                      </div>

                      <ul className="space-y-2 sm:space-y-3">
                        {benefit.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2 sm:gap-3">
                            <div className="mt-0.5 shrink-0">
                              <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full flex items-center justify-center bg-green-500 shadow-md">
                                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white font-semibold" />
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </ScrollRevealItem>
          ))}
        </ScrollRevealContainer>
      </div>
    </section>
  )
}
