import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 1024 * 1024 // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get file from FormData
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG and PNG images are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 1MB limit." },
        { status: 400 }
      )
    }

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    if (!["jpg", "jpeg", "png"].includes(fileExt)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only .jpg, .jpeg, and .png are allowed." },
        { status: 400 }
      )
    }

    // Generate unique filename: {user_id}/{timestamp}.{ext}
    const timestamp = Date.now()
    const fileName = `${user.id}/${timestamp}.${fileExt}`
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Delete old avatar if exists
    const { data: profileData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()

    if (profileData?.avatar_url) {
      // Extract path from URL if it's from Supabase Storage
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl && profileData.avatar_url.includes(supabaseUrl)) {
        const match = profileData.avatar_url.match(/\/avatars\/(.+)$/)
        if (match) {
          const oldPath = match[1]
          await supabase.storage.from("avatars").remove([oldPath])
        }
      }
    }

    // Upload new avatar
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload avatar", details: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    if (updateError) {
      // Try to delete uploaded file if profile update fails
      await supabase.storage.from("avatars").remove([fileName])
      return NextResponse.json(
        { error: "Failed to update profile", details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: fileName,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

