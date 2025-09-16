import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sweet Bakery - Handcrafted Treats",
  description: "Indulge in our handcrafted treats made with love and the finest ingredients.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

import ClientLayout from "./ClientLayout"
