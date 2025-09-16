"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
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
import type { ICoupon } from "@/lib/models/Coupon"
import DonutLoading from "@/components/donut-loading"

interface EditCouponPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditCouponPage({ params }: EditCouponPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [coupon, setCoupon] = useState<ICoupon | null>(null)
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

  useEffect(() => {
    fetchCoupon()
  }, [id])

  const fetchCoupon = async () => {
    try {
      const response = await fetch(`/api/coupons/${id}`)
      if (response.ok) {
        const couponData = await response.json()
        setCoupon(couponData)

        // Format dates for datetime-local input
        const validFrom = new Date(couponData.validFrom)
        const validUntil = new Date(couponData.validUntil)

        setFormData({
          code: couponData.code,
          description: couponData.description,
          discountType: couponData.discountType,
          discountValue: couponData.discountValue.toString(),
          minimumOrderAmount: couponData.minimumOrderAmount?.toString() || "",
          maximumDiscountAmount: couponData.maximumDiscountAmount?.toString() || "",
          usageLimit: couponData.usageLimit?.toString() || "",
          isActive: couponData.isActive,
          validFrom: validFrom.toISOString().slice(0, 16),
          validUntil: validUntil.toISOString().slice(0, 16),
        })
      } else {
        throw new Error("Failed to fetch coupon")
      }
    } catch (error) {
      console.error("Error fetching coupon:", error)
      toast({
        title: "Error",
        description: "Failed to fetch coupon details",
        variant: "destructive",
      })
      router.push("/admin/coupons")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "PUT",
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
          description: "Coupon updated successfully",
        })
        router.push("/admin/coupons")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update coupon")
      }
    } catch (error: any) {
      console.error("Error updating coupon:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update coupon",
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DonutLoading size="lg" />
          <p className="text-[#4A7C59] mt-4">Loading coupon details...</p>
        </div>
      </div>
    )
  }

  if (!coupon) {
    return (
      <div className="text-center py-8">
        <p className="text-[#4A7C59]">Coupon not found</p>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-[#2D5016]">Edit Coupon</h1>
          <p className="text-[#4A7C59] mt-1">Update coupon: {coupon.code}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Basic Information</CardTitle>
              <CardDescription>Update the basic coupon details</CardDescription>
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

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Usage Statistics</CardTitle>
              <CardDescription>Current usage information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#2D5016]">Times Used</Label>
                  <div className="text-2xl font-bold text-[#4A7C59]">{coupon.usedCount}</div>
                </div>
                <div>
                  <Label className="text-[#2D5016]">Usage Limit</Label>
                  <div className="text-2xl font-bold text-[#2D5016]">{coupon.usageLimit || "Unlimited"}</div>
                </div>
              </div>
              {coupon.usageLimit && (
                <div>
                  <Label className="text-[#2D5016]">Usage Progress</Label>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-[#4A7C59] h-2 rounded-full"
                      style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#4A7C59] mt-1">
                    {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                  </p>
                </div>
              )}
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#2D5016]">Validity Period</CardTitle>
              <CardDescription>Set when this coupon is valid</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              "Updating..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Coupon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
