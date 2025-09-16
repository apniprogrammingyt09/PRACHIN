import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API: Starting file upload process with Vercel Blob")

    const data = await request.formData()
    const file = data.get("file") as File | null

    if (!file) {
      console.log("Upload API: No file provided")
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    console.log(`Upload API: Received file: ${file.name}, type: ${file.type}, size: ${file.size}`)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.log(`Upload API: Invalid file type: ${file.type}`)
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB limit for blob storage)
    if (file.size > 10 * 1024 * 1024) {
      console.log(`Upload API: File too large: ${file.size} bytes`)
      return NextResponse.json({ success: false, error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 10)
    const fileExt = file.name.split(".").pop()
    const fileName = `product-images/${timestamp}-${randomStr}.${fileExt}`

    console.log(`Upload API: Uploading to blob storage with filename: ${fileName}`)

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    })

    console.log(`Upload API: Successfully uploaded to blob storage: ${blob.url}`)

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: fileName,
      size: file.size,
      type: file.type,
      downloadUrl: blob.downloadUrl,
    })
  } catch (error) {
    console.error("Upload API: Error uploading to blob storage:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file to blob storage",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
