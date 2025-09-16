"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  ShoppingBag,
  Users,
  Droplets,
  Clock,
  ChevronRight,
  BarChart3,
  Database,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeedButton } from "@/components/seed-button"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/data-context"

export default function AdminDashboard() {
  const { dashboardStats, orders, refreshDashboardStats, refreshOrders, isDashboardStatsCached, isOrdersCached } =
    useData()
  const [needsSeeding, setNeedsSeeding] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(!isDashboardStatsCached)
  const [isLoadingOrders, setIsLoadingOrders] = useState(!isOrdersCached)
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      if (!isDashboardStatsCached) {
        setIsLoadingStats(true)
        await refreshDashboardStats()
        setIsLoadingStats(false)
      }
      if (!isOrdersCached) {
        setIsLoadingOrders(true)
        await refreshOrders()
        setIsLoadingOrders(false)
      }
    }

    loadData()
    checkSeeding()
  }, [isDashboardStatsCached, isOrdersCached, refreshDashboardStats, refreshOrders])

  const checkSeeding = async () => {
    try {
      const seedCheck = await fetch("/api/seed-check")
      const seedData = await seedCheck.json()
      setNeedsSeeding(!seedData.seeded)
    } catch (error) {
      console.error("Error checking seeding status:", error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setIsLoadingStats(true)
    setIsLoadingOrders(true)
    await Promise.all([refreshDashboardStats(), refreshOrders()])
    await checkSeeding()
    setIsLoadingStats(false)
    setIsLoadingOrders(false)
    setRefreshing(false)
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated with the latest information.",
    })
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-800">Dashboard</h1>
          <p className="text-emerald-600 mt-1">Welcome back, Admin User</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {needsSeeding && (
            <div className="flex items-center gap-2 order-3 sm:order-1">
              <Database className="h-4 w-4 text-emerald-500" />
              <SeedButton />
            </div>
          )}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-800 order-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-200 text-emerald-800 order-1 sm:order-3 bg-transparent"
          >
            <Clock className="h-4 w-4 mr-2" /> {new Date().toLocaleDateString()}
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white order-4">
            <BarChart3 className="h-4 w-4 mr-2" /> Reports
          </Button>
        </div>
      </div>

      {/* Seeding Alert */}
      {needsSeeding && (
        <Card className="border-emerald-300 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Database className="h-6 w-6 text-emerald-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-emerald-800">Database Setup Required</h3>
                <p className="text-emerald-600 text-sm mt-1">
                  Your database appears to be empty. Click the "Seed Database" button to add initial Ayurvedic products.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-600 text-sm">Total Revenue</p>
                  {isLoadingStats ? (
                    <div className="flex items-center mt-1">
                      <div className="h-6 w-20 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1 truncate">
                      ₹{dashboardStats?.orders?.totalRevenue?.toLocaleString() || 0}
                    </h3>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      12.5%
                    </span>
                    <span className="text-xs text-emerald-600 ml-1 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-600 text-sm">Total Orders</p>
                  {isLoadingStats ? (
                    <div className="flex items-center mt-1">
                      <div className="h-6 w-16 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">
                      {dashboardStats?.orders?.totalOrders || 0}
                    </h3>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      8.2%
                    </span>
                    <span className="text-xs text-emerald-600 ml-1 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-600 text-sm">Total Customers</p>
                  {isLoadingStats ? (
                    <div className="flex items-center mt-1">
                      <div className="h-6 w-16 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">
                      {dashboardStats?.customers?.totalCustomers || 0}
                    </h3>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium flex items-center text-green-600">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      5.3%
                    </span>
                    <span className="text-xs text-emerald-600 ml-1 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-600 text-sm">Pending Orders</p>
                  {isLoadingStats ? (
                    <div className="flex items-center mt-1">
                      <div className="h-6 w-16 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mt-1">
                      {dashboardStats?.orders?.pendingOrders || 0}
                    </h3>
                  )}
                  <div className="flex items-center mt-1">
                    <span className="text-xs font-medium flex items-center text-red-600">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      2.1%
                    </span>
                    <span className="text-xs text-emerald-600 ml-1 hidden sm:inline">vs last month</span>
                  </div>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                  <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-emerald-800">Recent Orders</CardTitle>
                  <CardDescription className="text-emerald-600">Latest customer orders</CardDescription>
                </div>
                <Link href="/admin/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`loading-${i}`} className="flex items-center space-x-4">
                      <div className="h-4 w-20 bg-emerald-100 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-emerald-100 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-emerald-100 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-emerald-100 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-emerald-600">
                  No orders yet. Orders will appear here once customers start placing them.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-emerald-600 text-sm border-b border-emerald-200">
                        <th className="pb-2 font-medium">Order ID</th>
                        <th className="pb-2 font-medium hidden sm:table-cell">Customer</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Amount</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium hidden md:table-cell">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="border-b border-emerald-200 last:border-0">
                          <td className="py-3 text-emerald-800 font-medium text-sm">{order.orderNumber || 'N/A'}</td>
                          <td className="py-3 text-emerald-800 hidden sm:table-cell">
                            <div className="truncate max-w-[120px]">
                              {order.customer?.firstName || 'N/A'} {order.customer?.lastName || ''}
                            </div>
                          </td>
                          <td className="py-3 text-emerald-600 text-sm">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 text-emerald-800 font-medium">₹{(order.total || 0).toFixed(2)}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "preparing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "out_for_delivery"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status ? order.status.replace("_", " ") : 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 hidden md:table-cell">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : order.paymentStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.paymentStatus || 'Unknown'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products/new">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start">
                  <Droplets className="h-4 w-4 mr-2" /> Add New Product
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-800 justify-start bg-transparent"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> Process Orders
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button
                  variant="outline"
                  className="w-full border-emerald-200 text-emerald-800 justify-start bg-transparent"
                >
                  <Users className="h-4 w-4 mr-2" /> View Customers
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Live Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-800">Live Stats</CardTitle>
              <CardDescription className="text-emerald-600">Real-time updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Products</span>
                {isLoadingStats ? (
                  <div className="h-4 w-8 bg-emerald-100 rounded animate-pulse"></div>
                ) : (
                  <span className="font-medium text-emerald-800">{dashboardStats?.products?.total || 0}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Low Stock</span>
                {isLoadingStats ? (
                  <div className="h-4 w-8 bg-emerald-100 rounded animate-pulse"></div>
                ) : (
                  <span className="font-medium text-red-600">{dashboardStats?.products?.lowStock || 0}</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Active Customers</span>
                {isLoadingStats ? (
                  <div className="h-4 w-8 bg-emerald-100 rounded animate-pulse"></div>
                ) : (
                  <span className="font-medium text-emerald-800">
                    {dashboardStats?.customers?.activeCustomers || 0}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 text-sm">Today's Orders</span>
                {isLoadingStats ? (
                  <div className="h-4 w-8 bg-emerald-100 rounded animate-pulse"></div>
                ) : (
                  <span className="font-medium text-emerald-800">{dashboardStats?.orders?.todayOrders || 0}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
