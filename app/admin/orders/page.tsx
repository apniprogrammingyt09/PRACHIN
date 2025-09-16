"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-yellow-100 text-yellow-800",
  ready: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
}

const paymentMethodIcons = {
  card: CreditCard,
  upi: Wallet,
  cod: Truck,
  razorpay: Wallet,
}

const paymentMethodLabels = {
  card: "Card",
  upi: "UPI",
  cod: "COD",
  razorpay: "Razorpay",
}

export default function OrdersPage() {
  const { toast } = useToast()
  const { orders, refreshOrders, isOrdersCached, updateOrderCache } = useData()
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [paymentFilter, setPaymentFilter] = useState("All")
  const [sortBy, setSortBy] = useState("date-desc")

  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false)

  useEffect(() => {
    if (!isOrdersCached) {
      refreshOrders()
    } else if (orders.length > 0 && !orders[0].orderNumber) {
      // If orders exist but seem incomplete, refresh
      console.log('Orders data seems incomplete, refreshing...')
      refreshOrders()
    }
  }, [isOrdersCached, refreshOrders, orders])

  useEffect(() => {
    // Debug: Log the orders data
    console.log('Orders data:', orders)
    if (orders.length > 0) {
      console.log('First order structure:', orders[0])
    }
    
    // Filter out orders with missing essential data
    let filtered = orders.filter(order => order && order._id)
    filtered = [...filtered]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          (order.orderNumber || '').toLowerCase().includes(query) ||
          `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase().includes(query) ||
          (order.customer?.email || '').toLowerCase().includes(query) ||
          (order.razorpayPayment?.paymentId && order.razorpayPayment.paymentId.toLowerCase().includes(query)),
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
      default:
        break
    }

    setFilteredOrders(filtered)
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', { orderId, newStatus })
      const updatedOrder = await api.orders.updateStatus(orderId, newStatus)
      console.log('Status update response:', updatedOrder)

      // Update the cache with the response from the server
      updateOrderCache(updatedOrder)

      toast({
        title: "Order Status Updated",
        description: `Order status has been updated to ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: `Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const updatedOrder = await api.orders.updatePaymentStatus(orderId, newPaymentStatus)
      updateOrderCache(updatedOrder)

      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${newPaymentStatus}.`,
      })
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshPaymentStatus = async (orderId: string) => {
    try {
      const paymentStatus = await api.payment.getPaymentStatus(orderId)

      const currentOrder = orders.find((o) => o._id === orderId)
      if (currentOrder) {
        const updatedOrder = {
          ...currentOrder,
          paymentStatus: paymentStatus.paymentStatus,
          razorpayPayment: paymentStatus.razorpayPayment,
          updatedAt: new Date().toISOString(),
        }
        updateOrderCache(updatedOrder)
      }

      toast({
        title: "Payment Status Refreshed",
        description: `Payment status updated to ${paymentStatus.paymentStatus}.`,
      })
    } catch (error) {
      console.error("Error refreshing payment status:", error)
      toast({
        title: "Error",
        description: "Failed to refresh payment status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((order) => order._id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId])
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId))
    }
  }

  const handleBulkUpdate = async () => {
    if (selectedOrders.length === 0 || !bulkAction) return

    setIsUpdatingBulk(true)
    try {
      let result
      if (bulkAction.startsWith("status:")) {
        const status = bulkAction.replace("status:", "")
        result = await api.orders.bulkUpdateStatus(selectedOrders, status)
      } else if (bulkAction.startsWith("payment:")) {
        const paymentStatus = bulkAction.replace("payment:", "")
        result = await api.orders.bulkUpdatePaymentStatus(selectedOrders, paymentStatus)
      }

      // Update cache for all successfully updated orders
      if (result?.results) {
        result.results.forEach((updatedOrder: any) => {
          updateOrderCache(updatedOrder)
        })
      }

      toast({
        title: "Bulk Update Completed",
        description: `Successfully updated ${result?.updated || 0} orders${result?.errors > 0 ? ` (${result.errors} failed)` : ""}.`,
      })

      // Reset selections
      setSelectedOrders([])
      setBulkAction("")
    } catch (error) {
      console.error("Error bulk updating orders:", error)
      toast({
        title: "Error",
        description: "Failed to bulk update orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingBulk(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5016]">Orders</h1>
          <p className="text-[#4A7C59]">Manage customer orders and payments</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refreshOrders()}
            className="border-green-200 text-[#2D5016] bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" className="border-green-200 text-[#2D5016] bg-transparent">
            <Calendar className="h-4 w-4 mr-2" /> Filter by Date
          </Button>
          <Button className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
            <FileText className="h-4 w-4 mr-2" /> Export Orders
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
              <Input
                placeholder="Search orders by ID, customer name, email, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-green-200 focus-visible:ring-[#4A7C59]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-green-200 focus:ring-[#D4915D]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px] border-green-200 focus:ring-[#D4915D]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-green-200 focus:ring-[#D4915D]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedOrders.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#4A7C59] text-white">
                  {selectedOrders.length} selected
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrders([])}
                  className="border-green-200 text-[#2D5016]"
                >
                  Clear Selection
                </Button>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-[200px] border-green-200 focus:ring-[#D4915D]">
                    <SelectValue placeholder="Select bulk action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select action...</SelectItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <SelectItem key={status} value={`status:${status}`}>
                        {label}
                      </SelectItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                    <SelectItem value="payment:paid">Mark as Paid</SelectItem>
                    <SelectItem value="payment:pending">Mark as Pending</SelectItem>
                    <SelectItem value="payment:failed">Mark as Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleBulkUpdate}
                  disabled={!bulkAction || isUpdatingBulk}
                  className="bg-[#4A7C59] hover:bg-[#2D5016] text-white"
                >
                  {isUpdatingBulk ? "Updating..." : "Apply to Selected"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-green-200">
                  <th className="w-[50px] px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-[#4A7C59] data-[state=checked]:bg-[#4A7C59]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Order ID
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Customer</th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Items</th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Amount
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Payment</th>
                  <th className="w-[80px] px-4 py-3 text-right text-[#2D5016] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[#4A7C59]">
                      {orders.length === 0
                        ? "No orders found. Orders will appear here once customers start placing them."
                        : "No orders found. Try adjusting your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const PaymentIcon = paymentMethodIcons[order.paymentMethod as keyof typeof paymentMethodIcons] || CreditCard
                    return (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-green-200 last:border-0 hover:bg-green-50"
                      >
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedOrders.includes(order._id)}
                            onCheckedChange={(checked) => handleSelectOrder(order._id, checked as boolean)}
                            className="border-[#4A7C59] data-[state=checked]:bg-[#4A7C59]"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-[#2D5016]">{order.orderNumber || 'N/A'}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#2D5016]">
                            {order.customer?.firstName || 'N/A'} {order.customer?.lastName || ''}
                          </div>
                          <div className="text-sm text-[#4A7C59]">{order.customer?.email || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 text-[#4A7C59]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-4 py-3 text-[#4A7C59]">{order.items?.length || 0}</td>
                        <td className="px-4 py-3 font-medium text-[#4A7C59]">₹{(order.total || 0).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <Badge className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                            {statusLabels[order.status as keyof typeof statusLabels] || order.status || 'Unknown'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {PaymentIcon && <PaymentIcon className="h-4 w-4 text-[#4A7C59]" />}
                              <Badge
                                variant="outline"
                                className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}
                              >
                                {order.paymentStatus || 'Unknown'}
                              </Badge>
                            </div>
                            {order.razorpayPayment?.paymentId && order.razorpayPayment.paymentId && (
                              <div
                                className="text-xs text-[#4A7C59] truncate max-w-[120px]"
                                title={order.razorpayPayment.paymentId}
                              >
                                {order.razorpayPayment.paymentId}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/admin/orders/${order._id}`}>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                              </Link>
                              {order.paymentMethod === "razorpay" && (
                                <DropdownMenuItem onClick={() => handleRefreshPaymentStatus(order._id)}>
                                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh Payment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              {Object.entries(statusLabels).map(([status, label]) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => handleUpdateStatus(order._id, status)}
                                  disabled={order.status === status}
                                >
                                  {status === "out_for_delivery" && <Truck className="h-4 w-4 mr-2" />}
                                  {label}
                                </DropdownMenuItem>
                              ))}
                              {(order.paymentMethod === "cod" || order.paymentMethod === "razorpay") &&
                                order.paymentStatus !== "paid" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(order._id, "paid")}>
                                      <CreditCard className="h-4 w-4 mr-2" /> Mark as Paid
                                    </DropdownMenuItem>
                                    {order.paymentStatus === "pending" && (
                                      <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(order._id, "failed")}>
                                        <X className="h-4 w-4 mr-2" /> Mark as Failed
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
