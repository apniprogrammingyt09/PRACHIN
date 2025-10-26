import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    theme: "light",
    currency: "INR",
    language: "en"
  })
}

export async function POST() {
  return NextResponse.json({ success: true })
}