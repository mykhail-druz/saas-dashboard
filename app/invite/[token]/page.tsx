"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function InviteAcceptPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [status, setStatus] = useState<"loading" | "success" | "error" | "checking">("checking")
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function checkInvitation() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // User not logged in, redirect to login with return URL
          router.push(`/login?redirect=/invite/${token}`)
          return
        }

        // Find invitation by token
        const { data: invitation, error: inviteError } = await supabase
          .from("invitations")
          .select("*, organizations(*)")
          .eq("token", token)
          .single()

        if (inviteError || !invitation) {
          setStatus("error")
          setMessage("Invalid or expired invitation link")
          return
        }

        // Check if invitation is expired
        if (new Date(invitation.expires_at) < new Date()) {
          setStatus("error")
          setMessage("This invitation has expired")
          return
        }

        // Check if already accepted
        if (invitation.accepted_at) {
          setStatus("error")
          setMessage("This invitation has already been accepted")
          return
        }

        // Check if user is already a member
        const { data: existingMember } = await supabase
          .from("organization_members")
          .select("id")
          .eq("organization_id", invitation.organization_id)
          .eq("user_id", user.id)
          .single()

        if (existingMember) {
          setStatus("success")
          setMessage("You are already a member of this organization")
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
          return
        }

        // Check if invitation email matches user email
        if (invitation.email !== user.email) {
          setStatus("error")
          setMessage(
            `This invitation was sent to ${invitation.email}, but you are logged in as ${user.email}`
          )
          return
        }

        // Accept invitation
        setStatus("loading")
        const { error: acceptError } = await supabase
          .from("organization_members")
          .insert({
            organization_id: invitation.organization_id,
            user_id: user.id,
            role: invitation.role,
            invited_by: invitation.invited_by,
          })

        if (acceptError) {
          throw acceptError
        }

        // Mark invitation as accepted
        await supabase
          .from("invitations")
          .update({ accepted_at: new Date().toISOString() })
          .eq("id", invitation.id)

        setStatus("success")
        setMessage(
          `Successfully joined ${(invitation.organizations as any)?.name || "the organization"}!`
        )
        toast.success("Invitation accepted", {
          description: "Redirecting to dashboard...",
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        setStatus("error")
        setMessage(
          error instanceof Error ? error.message : "Failed to accept invitation"
        )
        toast.error("Failed to accept invitation")
      }
    }

    if (token) {
      checkInvitation()
    }
  }, [token, router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            {status === "checking" && "Checking invitation..."}
            {status === "loading" && "Accepting invitation..."}
            {status === "success" && "Invitation accepted!"}
            {status === "error" && "Error"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "checking" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Verifying invitation...</p>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Joining organization...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center text-sm">{message}</p>
              <Button onClick={() => router.push("/dashboard")} className="mt-4">
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-center text-sm text-destructive">{message}</p>
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

