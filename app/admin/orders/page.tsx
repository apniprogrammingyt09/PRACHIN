"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  MoreHorizontal,
  Eye,
  FileText,
  Truck,
  X,
  Calendar,
  ArrowUpDown,
  CreditCard,
  Wallet,
  RefreshCw,
  Filter,
  Download,

  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Ship,

} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { useData } from "@/contexts/data-context"
import Image from "next/image"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

const paymentStatusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
}

export default function OrdersPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { orders, refreshOrders, isOrdersCached, updateOrderCache } = useData()
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  useEffect(() => {
    if (!isOrdersCached) {
      refreshOrders()
    }
  }, [isOrdersCached, refreshOrders])

  useEffect(() => {
    let filtered = orders.filter(order => order && order._id)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          (order.orderNumber || '').toLowerCase().includes(query) ||
          `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase().includes(query) ||
          (order.customer?.email || '').toLowerCase().includes(query)
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (paymentFilter !== "All") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter)
    }

    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      case "amount-asc":
        filtered.sort((a, b) => (a.total || 0) - (b.total || 0))
        break
      case "amount-desc":
        filtered.sort((a, b) => (b.total || 0) - (a.total || 0))
        break
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await api.orders.updateStatus(orderId, newStatus)
      updateOrderCache(updatedOrder)
      toast({
        title: "Order Updated",
        description: `Order status updated to ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    }
  }

  const stats = {
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
    deliveredOrders: filteredOrders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track your orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => refreshOrders()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const csvData = filteredOrders.map(o => ({
                'Order ID': o.orderNumber || 'N/A',
                Customer: `${o.customer?.firstName || 'N/A'} ${o.customer?.lastName || ''}`,
                Date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A',
                Items: o.items?.length || 0,
                Amount: (o.total || 0).toFixed(2),
                Status: o.status || 'Unknown',
                Payment: o.paymentStatus || 'Unknown'
              }))
              const csv = [Object.keys(csvData[0]).join(','), ...csvData.map(row => Object.values(row).join(','))].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payment</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest</SelectItem>
                  <SelectItem value="date-asc">Oldest</SelectItem>
                  <SelectItem value="amount-desc">Highest</SelectItem>
                  <SelectItem value="amount-asc">Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        <div className="flex items-center space-x-3">
                          {order.items?.[0] && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <Image
                                className="h-10 w-10 rounded-lg object-cover"
                                src={order.items[0].image?.startsWith('data:') ? order.items[0].image : `data:image/jpeg;base64,${order.items[0].image}`}
                                alt={order.items[0].name}
                                width={40}
                                height={40}
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.items?.[0]?.name || 'No items'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items?.length > 1 ? `+${order.items.length - 1} more` : `${order.items?.length || 0} item${order.items?.length !== 1 ? 's' : ''}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        <div className="font-medium text-gray-900">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{order.customer?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        <Badge variant="outline" className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 cursor-pointer" onClick={() => router.push(`/admin/orders/${order._id}`)}>
                        ₹{(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {order.status === 'confirmed' && !order.shiprocket?.orderId && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async (e) => {
                                e.stopPropagation()
                                router.push(`/admin/orders/${order._id}/shipment`)
                                // Refresh orders after navigation to update the list
                                setTimeout(() => refreshOrders(), 2000)
                              }}
                              className="text-xs"
                            >
                              <Ship className="h-3 w-3" />
                            </Button>
                          )}


                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}