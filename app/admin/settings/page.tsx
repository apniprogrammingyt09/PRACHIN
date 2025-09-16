"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UserProfile {
  username: string
  email: string
  role: string
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          // Not authenticated, redirect to login
          window.location.href = "/admin/login"
          return
        }

        const data = await response.json()
        setUser(data.user)
        setProfileForm({
          username: data.user.username,
          email: data.user.email,
        })
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchUserData()
  }, [toast])

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear password error when typing
    if (passwordError) {
      setPasswordError("")
    }
  }

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/admin/settings/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: profileForm.username,
          email: profileForm.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        toast({
          title: "Update Failed",
          description: data.error || "Failed to update profile. Please try again.",
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
      setIsSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/admin/settings/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Reset form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        })
      } else {
        setPasswordError(data.error || "Failed to change password. Please try again.")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mt-4 text-[#4A7C59]">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D5016]">Account Settings</h1>
        <p className="text-[#4A7C59] mt-2">Manage your account settings and change your password</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-green-50 border border-green-200">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#FEEBD7] data-[state=active]:text-[#2D5016]">
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-[#FEEBD7] data-[state=active]:text-[#2D5016]">
            Password
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#2D5016]">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A7C59]" />
                    <Input
                      id="username"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="pl-10 border-green-200 focus:border-[#4A7C59] focus:ring-[#D4915D]"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2D5016]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A7C59]" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="pl-10 border-green-200 focus:border-[#4A7C59] focus:ring-[#D4915D]"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Role Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#2D5016]">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={user?.role || "admin"}
                    className="border-green-200 bg-green-50 text-[#4A7C59]"
                    disabled
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSaving} className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
                    {isSaving ? (
                      <div className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Error Alert */}
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {/* Current Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-[#2D5016]">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A7C59]" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 border-green-200 focus:border-[#4A7C59] focus:ring-[#D4915D]"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] hover:text-[#2D5016] transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-[#2D5016]">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A7C59]" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 border-green-200 focus:border-[#4A7C59] focus:ring-[#D4915D]"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] hover:text-[#2D5016] transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#4A7C59]">Password must be at least 8 characters long</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#2D5016]">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A7C59]" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10 border-green-200 focus:border-[#4A7C59] focus:ring-[#D4915D]"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] hover:text-[#2D5016] transition-colors"
                      disabled={isChangingPassword}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#4A7C59] hover:bg-[#2D5016] text-white"
                  >
                    {isChangingPassword ? (
                      <div className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-green-50 border-t border-green-200 flex flex-col items-start">
              <p className="text-sm text-[#4A7C59]">
                <strong>Password Security Tips:</strong>
              </p>
              <ul className="text-xs text-[#4A7C59] list-disc pl-5 mt-2 space-y-1">
                <li>Use at least 8 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Add numbers and special characters</li>
                <li>Don't reuse passwords from other sites</li>
              </ul>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
