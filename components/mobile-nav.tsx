"use client"

import Link from "next/link"
import { Home, Grid3X3, ShoppingBag, Truck } from "lucide-react"
import { usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"

export function MobileNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Don't show mobile nav on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      isActive: pathname === "/",
    },
    {
      href: "/menu",
      icon: Grid3X3,
      label: "Products",
      isActive: pathname === "/menu",
    },
    {
      href: "/cart",
      icon: ShoppingBag,
      label: "Cart",
      isActive: pathname === "/cart",
      badge: totalItems > 0 ? totalItems : null,
    },
    {
      href: "/track",
      icon: Truck,
      label: "Track Order",
      isActive: pathname === "/track-order",
    },
  ]

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white text-gray-700 z-50 shadow-lg border-t border-green-200 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${
                item.isActive ? "text-[#4A7C59]" : "text-gray-700 hover:text-[#4A7C59]"
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6 mb-1" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-[#4A7C59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
