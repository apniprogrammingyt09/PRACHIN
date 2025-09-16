"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function NewCouponPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    isActive: true,
    validFrom: "",
    validUntil: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          discountValue: Number.parseFloat(formData.discountValue),
          minimumOrderAmount: formData.minimumOrderAmount ? Number.parseFloat(formData.minimumOrderAmount) : 0,
          maximumDiscountAmount: formData.maximumDiscountAmount
            ? Number.parseFloat(formData.maximumDiscountAmount)
            : undefined,
          usageLimit: formData.usageLimit ? Number.parseInt(formData.usageLimit) : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Coupon created successfully",
        })
        router.push("/admin/coupons")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create coupon")
      }
    } catch (error: any) {
      console.error("Error creating coupon:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons">
          <Button variant="ghost" size="sm" className="text-[#2D5016]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Coupons
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#2D5016]">Create New Coupon</h1>
          <p className="text-[#4A7C59] mt-1">Add a new discount coupon</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Basic Information</CardTitle>
              <CardDescription>Enter the basic coupon details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-[#2D5016]">
                  Coupon Code *
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  placeholder="e.g., SAVE20"
                  required
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-[#2D5016]">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this coupon is for"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive" className="text-[#2D5016]">
                  Active
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Discount Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Discount Settings</CardTitle>
              <CardDescription>Configure the discount amount and type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discountType" className="text-[#2D5016]">
                  Discount Type *
                </Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleInputChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discountValue" className="text-[#2D5016]">
                  Discount Value * {formData.discountType === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) => handleInputChange("discountValue", e.target.value)}
                  placeholder={formData.discountType === "percentage" ? "20" : "10.00"}
                  required
                />
              </div>
              {formData.discountType === "percentage" && (
                <div>
                  <Label htmlFor="maximumDiscountAmount" className="text-[#2D5016]">
                    Maximum Discount Amount ($)
                  </Label>
                  <Input
                    id="maximumDiscountAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maximumDiscountAmount}
                    onChange={(e) => handleInputChange("maximumDiscountAmount", e.target.value)}
                    placeholder="50.00"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Usage Restrictions</CardTitle>
              <CardDescription>Set limits and requirements for coupon usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="minimumOrderAmount" className="text-[#2D5016]">
                  Minimum Order Amount ($)
                </Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimumOrderAmount}
                  onChange={(e) => handleInputChange("minimumOrderAmount", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="usageLimit" className="text-[#2D5016]">
                  Usage Limit
                </Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </CardContent>
          </Card>

          {/* Validity Period */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Validity Period</CardTitle>
              <CardDescription>Set when this coupon is valid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="validFrom" className="text-[#2D5016]">
                  Valid From *
                </Label>
                <Input
                  id="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange("validFrom", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="validUntil" className="text-[#2D5016]">
                  Valid Until *
                </Label>
                <Input
                  id="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange("validUntil", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Coupon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
