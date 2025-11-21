import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SubscriptionsService } from "@/lib/services/subscriptions.service"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { plan, organizationId } = body

    if (!plan || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields: plan and organizationId" },
        { status: 400 }
      )
    }

    // Validate plan
    const validPlans = ["free", "pro", "enterprise"]
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Invalid plan. Must be one of: ${validPlans.join(", ")}` },
        { status: 400 }
      )
    }

    // Check if user has permission to manage subscriptions (owner or admin)
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single()

    if (!member || !["owner", "admin"].includes(member.role)) {
      return NextResponse.json(
        { error: "You don't have permission to manage subscriptions for this organization" },
        { status: 403 }
      )
    }

    // Activate the plan
    const subscriptionsService = new SubscriptionsService(supabase)
    const subscription = await subscriptionsService.activatePlan(plan, user.id, organizationId)

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

