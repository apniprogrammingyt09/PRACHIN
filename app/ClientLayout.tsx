"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { DataProvider } from "@/contexts/data-context"
import { LanguageProvider } from "@/contexts/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith("/admin")

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <div>
        <Navbar />
        <main className="flex-grow pb-16 md:pb-0">{children}</main>
        <Footer />
      </div>
      <MobileNav />
    </>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <DataProvider>
              <CartProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
                <Toaster />
              </CartProvider>
            </DataProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
