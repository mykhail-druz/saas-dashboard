import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    const { email, organizationId, role } = body

    if (!email || !organizationId || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user has permission to invite (admin or owner)
    const { data: member } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single()

    if (!member || !["owner", "admin"].includes(member.role)) {
      return NextResponse.json(
        { error: "You don't have permission to invite users" },
        { status: 403 }
      )
    }

    // Generate token using database function
    const { data: tokenData, error: tokenError } = await supabase.rpc(
      "generate_invitation_token"
    )

    if (tokenError) {
      // Fallback: generate token in code
      const token = Buffer.from(
        `${email}-${organizationId}-${Date.now()}-${Math.random()}`
      )
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 64)

      return NextResponse.json({ token })
    }

    return NextResponse.json({ token: tokenData })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

