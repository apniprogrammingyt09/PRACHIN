"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { totalItems } = useCart()
  const pathname = usePathname()
  const router = useRouter()

  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/track", label: "Track Order" },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Prachin Ayurved" width={40} height={40} className="object-contain" />
              <span className="text-2xl font-bold text-[#2D5016]">
                Prachin<span className="text-[#4A7C59]"> Ayurved</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-700 hover:text-[#4A7C59] transition-colors ${
                    pathname === link.href ? "text-[#4A7C59] font-medium" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10 w-64 border-[#4A7C59]/20 focus:border-[#4A7C59]"
                />
              </form>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-[#4A7C59]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4A7C59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Button asChild className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
                <Link href="/contact">Order Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-6 mt-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-lg font-medium transition-colors ${
                          pathname === link.href ? "text-[#4A7C59]" : "text-gray-700 hover:text-[#4A7C59]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      <Button asChild className="w-full bg-[#4A7C59] hover:bg-[#2D5016] text-white">
                        <Link href="/contact" onClick={() => setIsOpen(false)}>
                          Order Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navigation */}
      <nav className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 h-10 border-[#4A7C59]/30 focus:border-[#4A7C59] rounded-full bg-[#F0F8F0]"
              />
            </form>

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A7C59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Order Now Button */}
            <Button asChild size="sm" className="bg-[#4A7C59] hover:bg-[#2D5016] text-white rounded-full px-4">
              <Link href="/contact">Order Now</Link>
            </Button>

            {/* Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="sr-only">
                  <SheetTitle>Mobile Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6 mt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Image src="/logo.png" alt="Prachin Ayurved" width={32} height={32} className="object-contain" />
                      <h2 className="text-2xl font-bold text-[#2D5016]">
                        Prachin<span className="text-[#4A7C59]"> Ayurved</span>
                      </h2>
                    </div>
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors py-2 px-4 rounded-lg ${
                        pathname === link.href
                          ? "text-[#4A7C59] bg-[#FFF9F0]"
                          : "text-gray-700 hover:text-[#4A7C59] hover:bg-[#FFF9F0]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <form onSubmit={handleSearch} className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-[#4A7C59]/30 focus:border-[#4A7C59] rounded-full"
                        />
                      </div>
                    </form>
                    <Button asChild className="w-full bg-[#4A7C59] hover:bg-[#2D5016] text-white">
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        Order Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  )
}
