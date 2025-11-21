"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/scroll-reveal"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "For individual users and small teams",
    price: "0",
    period: "forever",
    features: [
      "Up to 3 users",
      "Basic reports",
      "5 integrations",
      "Email support",
      "Up to 10,000 events/month",
      "Basic analytics",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Professional",
    description: "For growing companies with advanced needs",
    price: "29",
    period: "per month",
    features: [
      "Up to 25 users",
      "Advanced reports",
      "Unlimited integrations",
      "Priority support",
      "Up to 100,000 events/month",
      "Advanced analytics",
      "Custom dashboards",
      "Data export",
    ],
    cta: "Start trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with special requirements",
    price: "99",
    period: "per month",
    features: [
      "Unlimited users",
      "All Professional features",
      "Dedicated manager",
      "24/7 support",
      "Unlimited events",
      "AI forecasting",
      "Custom integrations",
      "SLA guarantee",
      "Personal training",
    ],
    cta: "Contact sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal type="fadeUp" duration={0.8} className="text-center space-y-4 mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Choose the right plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Flexible pricing for any business size. Start free or choose a plan with additional features
          </p>
        </ScrollReveal>

        <ScrollRevealContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollRevealItem 
              key={index} 
              type={index === 1 ? "scale" : "fadeUp"} 
              duration={0.7}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge 
                    className="text-white border-0 shadow-lg"
                    style={{
                      background: "linear-gradient(to right, #5227FF, #a855f7, #60a5fa)",
                    }}
                  >
                    Popular
                  </Badge>
                </div>
              )}
              {plan.popular ? (
                <div 
                  className="h-full rounded-lg p-[2px]"
                  style={{
                    background: 'linear-gradient(90deg, #5227FF, #a855f7, #60a5fa, #5227FF)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-border 3s linear infinite',
                  }}
                >
                  <style>{`
                    @keyframes gradient-border {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 200% 50%;
                      }
                    }
                  `}</style>
                  <SpotlightCard className="h-full rounded-lg overflow-hidden">
                    <Card
                      className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg md:scale-105 rounded-lg"
                    >
                      <CardHeader className="text-center pb-6">
                        <CardTitle className="text-xl sm:text-2xl mb-2">{plan.name}</CardTitle>
                        <CardDescription className="text-sm sm:text-base mb-6">
                          {plan.description}
                        </CardDescription>
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl sm:text-5xl font-bold">
                              {plan.price === "0" ? (
                                "Free"
                              ) : (
                                <>
                                  ${plan.price}
                                  <span className="text-xl sm:text-2xl text-muted-foreground">
                                    /{plan.period.split(" ")[0]}
                                  </span>
                                </>
                              )}
                            </span>
                          </div>
                          {plan.price !== "0" && (
                            <p className="text-xs sm:text-sm text-muted-foreground">{plan.period}</p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-3 sm:space-y-4">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div className="mt-0.5 shrink-0">
                                <div className="h-5 w-5 rounded-full flex items-center justify-center bg-green-500 shadow-md">
                                  <Check className="h-3 w-3 text-white font-semibold" />
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant="default"
                          size="lg"
                          asChild
                        >
                          <Link href="/register">{plan.cta}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </SpotlightCard>
                </div>
              ) : (
                <SpotlightCard className="h-full rounded-lg overflow-hidden">
                  <Card
                    className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/50 rounded-lg"
                  >
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-xl sm:text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base mb-6">
                        {plan.description}
                      </CardDescription>
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl sm:text-5xl font-bold">
                            {plan.price === "0" ? (
                              "Free"
                            ) : (
                              <>
                                ${plan.price}
                                <span className="text-xl sm:text-2xl text-muted-foreground">
                                  /{plan.period.split(" ")[0]}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                        {plan.price !== "0" && (
                          <p className="text-xs sm:text-sm text-muted-foreground">{plan.period}</p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3 sm:space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              <div className="h-5 w-5 rounded-full flex items-center justify-center bg-green-500 shadow-md">
                                <Check className="h-3 w-3 text-white font-semibold" />
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant="outline"
                        size="lg"
                        asChild
                      >
                        <Link href="/register">{plan.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </SpotlightCard>
              )}
            </ScrollRevealItem>
          ))}
        </ScrollRevealContainer>
      </div>
    </section>
  )
}
