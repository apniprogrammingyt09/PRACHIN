"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Calendar, Percent, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import type { ICoupon } from "@/lib/models/Coupon"
import { useData } from "@/contexts/data-context"

export default function CouponsPage() {
  const { coupons, refreshCoupons, isCouponsCached, updateCouponCache } = useData()
  const [filteredCoupons, setFilteredCoupons] = useState<ICoupon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, used: 0 })
  const { toast } = useToast()

  useEffect(() => {
    if (!isCouponsCached) {
      refreshCoupons()
    }
    fetchStats()
  }, [isCouponsCached, refreshCoupons])

  useEffect(() => {
    const filtered = coupons.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCoupons(filtered)
  }, [coupons, searchTerm])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/coupons/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const toggleCouponStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/coupons/${id}/toggle`, {
        method: "PATCH",
      })

      if (response.ok) {
        const updatedCoupon = await response.json()
        updateCouponCache(id, updatedCoupon)
        toast({
          title: "Success",
          description: `Coupon ${updatedCoupon.isActive ? "activated" : "deactivated"} successfully`,
        })
        fetchStats()
      } else {
        throw new Error("Failed to toggle coupon status")
      }
    } catch (error) {
      console.error("Error toggling coupon:", error)
      toast({
        title: "Error",
        description: "Failed to toggle coupon status",
        variant: "destructive",
      })
    }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        refreshCoupons()
        toast({
          title: "Success",
          description: "Coupon deleted successfully",
        })
        fetchStats()
      } else {
        throw new Error("Failed to delete coupon")
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString()
  }

  const getCouponStatus = (coupon: ICoupon) => {
    const now = new Date()
    const validUntil = new Date(coupon.validUntil)

    if (!coupon.isActive) return { label: "Inactive", color: "secondary" }
    if (validUntil < now) return { label: "Expired", color: "destructive" }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { label: "Used Up", color: "destructive" }
    return { label: "Active", color: "default" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2D5016]">Coupon Management</h1>
          <p className="text-[#4A7C59] mt-1">Manage discount coupons and promotional codes</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add New Coupon
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#2D5016]">Total Coupons</CardTitle>
            <Percent className="h-4 w-4 text-[#4A7C59]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2D5016]">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#2D5016]">Active Coupons</CardTitle>
            <ToggleRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#2D5016]">Expired Coupons</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#2D5016]">Used Coupons</CardTitle>
            <DollarSign className="h-4 w-4 text-[#4A7C59]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4A7C59]">{stats.used}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2D5016]">Search Coupons</CardTitle>
          <CardDescription>Search by coupon code or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#2D5016]">All Coupons</CardTitle>
          <CardDescription>
            {filteredCoupons.length} of {coupons.length} coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#4A7C59]">No coupons found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#2D5016]">Code</TableHead>
                    <TableHead className="text-[#2D5016]">Description</TableHead>
                    <TableHead className="text-[#2D5016]">Discount</TableHead>
                    <TableHead className="text-[#2D5016]">Usage</TableHead>
                    <TableHead className="text-[#2D5016]">Valid Until</TableHead>
                    <TableHead className="text-[#2D5016]">Status</TableHead>
                    <TableHead className="text-[#2D5016]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => {
                    const status = getCouponStatus(coupon)
                    return (
                      <TableRow key={coupon._id}>
                        <TableCell className="font-mono font-bold text-[#2D5016]">{coupon.code}</TableCell>
                        <TableCell className="text-[#4A7C59]">{coupon.description}</TableCell>
                        <TableCell className="text-[#4A7C59]">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </TableCell>
                        <TableCell className="text-[#4A7C59]">
                          {coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : coupon.usedCount}
                        </TableCell>
                        <TableCell className="text-[#4A7C59]">{formatDate(coupon.validUntil)}</TableCell>
                        <TableCell>
                          <Badge variant={status.color as any}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCouponStatus(coupon._id!)}
                              className="text-[#4A7C59] hover:bg-green-50"
                            >
                              {coupon.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Link href={`/admin/coupons/${coupon._id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-[#4A7C59] hover:bg-green-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCoupon(coupon._id!)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
