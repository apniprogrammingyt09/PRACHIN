"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User, LogIn, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          // Already logged in, redirect to dashboard
          window.location.href = "/admin"
        }
      } catch (error) {
        // Not logged in, stay on login page
        console.error("Auth check error:", error)
      }
    }

    checkAuth()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login Successful! 🎉",
          description: "Redirecting to admin dashboard...",
        })

        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = "/admin"
        }, 1000)
      } else {
        toast({
          title: "Login Failed ❌",
          description: data.error || "Invalid username or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center"
            >
              <Leaf className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Prachin<span className="text-emerald-600">Ayurved</span>
            </CardTitle>
            <CardDescription className="text-emerald-600 mt-2">Admin Panel Access</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-emerald-800 font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-800 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing In...
                    </div>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In to Admin Panel
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center"
            >
              <p className="text-sm text-emerald-700 mb-2 font-medium">Default Credentials:</p>
              <div className="space-y-1 text-xs">
                <p className="text-emerald-800">
                  <span className="font-medium">Username:</span> admin
                </p>
                <p className="text-emerald-800">
                  <span className="font-medium">Password:</span> ayurved123
                </p>
              </div>
            </motion.div>

            {/* Back to Site */}
            <div className="text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors underline"
                disabled={isLoading}
              >
                ← Back to Website
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
