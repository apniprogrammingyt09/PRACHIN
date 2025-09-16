"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Droplets,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  MenuIcon,
  X,
  ChevronDown,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import DonutLoading from "@/components/donut-loading"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<any>(null)

  // Check authentication on mount and route changes
  useEffect(() => {
    const checkAuth = async () => {
      // If on login page, don't check auth
      if (pathname === "/admin/login") {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/me")

        if (response.ok) {
          const data = await response.json()
          setIsAuthenticated(true)
          setAdminUser(data.user)
        } else {
          // Not authenticated, redirect to login
          window.location.href = "/admin/login"
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Redirect to login on error
        window.location.href = "/admin/login"
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      toast({
        title: "Logged Out Successfully",
        description: "You have been safely logged out of the admin panel.",
      })

      // Close mobile menu if open
      setIsMobileMenuOpen(false)

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/admin/login"
      }, 1000)
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Error",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <DonutLoading size="lg" />
          <p className="text-amber-700 mt-4">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If on login page, don't show admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // If not authenticated, don't render admin layout (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <DonutLoading size="lg" />
          <p className="text-amber-700 mt-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Droplets },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Percent },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b border-green-200">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#2D5016]">
            Prachin<span className="text-[#4A7C59]">Ayurved</span>
          </span>
          <span className="bg-green-100 text-[#2D5016] text-xs px-2 py-1 rounded-md font-medium">Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Back to Website Button - Mobile */}
          <button
            onClick={() => (window.location.href = "/")}
            className="text-[#2D5016] hover:bg-green-50 px-2 py-1 rounded text-sm"
          >
            Website
          </button>

          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#2D5016]">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full bg-white">
                {/* Mobile Menu Header */}
                <div className="p-4 border-b border-green-200">
                  <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-lg font-bold text-[#2D5016]">
                      Prachin<span className="text-[#4A7C59]">Ayurved</span>
                    </span>
                    <span className="bg-green-100 text-[#2D5016] text-xs px-2 py-1 rounded-md">Admin</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-auto py-4">
                  <nav className="flex flex-col gap-1 px-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-green-100 text-[#2D5016] font-medium"
                            : "text-[#4A7C59] hover:bg-green-50 hover:text-[#2D5016]"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-[#2D5016] font-bold text-sm">
                        {adminUser?.username?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2D5016] text-sm truncate">
                        {adminUser?.username || "Admin User"}
                      </p>
                      <p className="text-xs text-[#4A7C59] truncate">
                        {adminUser?.email || "admin@prachinayurved.com"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="w-full border border-[#4A7C59] text-[#4A7C59] hover:bg-green-50 text-sm py-2 px-4 rounded"
                    >
                      Back to Website
                    </button>
                    <Button onClick={handleLogout} variant="destructive" className="w-full text-sm">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-green-200 shadow-sm">
          {/* Desktop Header */}
          <div className="flex items-center gap-2 h-16 px-6 border-b border-green-200">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#2D5016]">
                Prachin<span className="text-[#4A7C59]">Ayurved</span>
              </span>
              <span className="bg-green-100 text-[#2D5016] text-xs px-2 py-1 rounded-md">Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-green-100 text-[#2D5016] font-medium"
                      : "text-[#4A7C59] hover:bg-green-50 hover:text-[#2D5016]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Footer */}
          <div className="p-4 border-t border-green-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-3 py-2 text-[#2D5016] hover:bg-green-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-[#2D5016] font-bold">
                        {adminUser?.username?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium truncate">{adminUser?.username || "Admin User"}</p>
                      <p className="text-xs text-[#4A7C59] truncate">
                        {adminUser?.email || "admin@prachinayurved.com"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/admin/settings">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Account Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => (window.location.href = "/")}>Back to Website</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="py-4 px-4 sm:py-6 sm:px-6 lg:px-8 min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
