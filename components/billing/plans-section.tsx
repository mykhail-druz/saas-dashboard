"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useOrganization } from "@/lib/contexts/OrganizationContext"
import { Database } from "@/types/database.types"

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"]

const plans = [
  {
    name: "Starter",
    dbPlan: "free",
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
    popular: false,
  },
  {
    name: "Professional",
    dbPlan: "pro",
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
    popular: true,
  },
  {
    name: "Enterprise",
    dbPlan: "enterprise",
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
    popular: false,
  },
]

interface PlansSectionProps {
  currentSubscription?: Subscription | null
  onPlanActivated?: () => void
}

export function PlansSection({ currentSubscription, onPlanActivated }: PlansSectionProps) {
  const { currentOrganization } = useOrganization()
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<string | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  useEffect(() => {
    if (currentSubscription?.plan) {
      setActivePlan(currentSubscription.plan)
    }
  }, [currentSubscription])

  const handleActivatePlan = async (planDbName: string, planName: string) => {
    if (!currentOrganization) {
      toast.error("No organization selected")
      return
    }

    // If already on this plan, do nothing
    if (activePlan === planDbName) {
      toast.info(`You are already on the ${planName} plan`)
      return
    }

    setLoadingPlan(planDbName)

    try {
      const response = await fetch("/api/subscriptions/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planDbName,
          organizationId: currentOrganization.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate plan")
      }

      setActivePlan(planDbName)
      toast.success(`Successfully activated ${planName} plan`)
      onPlanActivated?.()
      // Refresh the page to update the subscription data
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to activate plan"
      toast.error(message)
    } finally {
      setLoadingPlan(null)
    }
  }

  const getButtonText = (plan: typeof plans[0], isActive: boolean, isLoading: boolean) => {
    if (isLoading) {
      return "Activating..."
    }
    if (isActive) {
      return "Current Plan"
    }
    if (plan.dbPlan === "free") {
      return "Activate Free Plan"
    }
    return `Activate ${plan.name}`
  }

  const getButtonVariant = (plan: typeof plans[0], isActive: boolean) => {
    if (isActive) {
      return "default" as const
    }
    if (plan.popular) {
      return "default" as const
    }
    return "outline" as const
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select a plan that best fits your needs. You can change your plan at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isActive = activePlan === plan.dbPlan
          const isLoading = loadingPlan === plan.dbPlan

          return (
            <div key={index} className="relative">
              {plan.popular && !isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
              )}
              {isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-green-500 text-white">Current Plan</Badge>
                </div>
              )}
              <SpotlightCard className="h-full">
                <Card
                  className={`h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-2 ${
                    isActive
                      ? "border-green-500 shadow-lg"
                      : plan.popular
                        ? "border-primary shadow-lg"
                        : "hover:border-primary/50"
                  }`}
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
                                /mo
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
                          <div className="mt-0.5 flex-shrink-0">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={getButtonVariant(plan, isActive)}
                      size="lg"
                      onClick={() => handleActivatePlan(plan.dbPlan, plan.name)}
                      disabled={isActive || isLoading || !currentOrganization}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Activating...
                        </>
                      ) : (
                        getButtonText(plan, isActive, false)
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </SpotlightCard>
            </div>
          )
        })}
      </div>
    </div>
  )
}

