"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  ready: CheckCircle,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  cancelled: Clock,
}

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
  pending: "Order Placed",
  confirmed: "Order Confirmed",
  preparing: "Preparing",
  ready: "Ready for Pickup",
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
  card: "Credit/Debit Card",
  upi: "UPI",
  cod: "Cash on Delivery",
  razorpay: "Razorpay",
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [refreshingPayment, setRefreshingPayment] = useState(false)
  const { toast } = useToast()

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Order Number Required",
        description: "Please enter your order number to track your order.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setNotFound(false)
    setOrder(null)

    try {
      const orders = await api.orders.getAll()
      const foundOrder = orders.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase())

      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshPaymentStatus = async () => {
    if (!order || order.paymentMethod !== "razorpay") return

    setRefreshingPayment(true)
    try {
      const paymentStatus = await api.payment.getPaymentStatus(order._id)
      setOrder({
        ...order,
        paymentStatus: paymentStatus.paymentStatus,
        razorpayPayment: paymentStatus.razorpayPayment,
      })

      toast({
        title: "Payment Status Updated",
        description: `Payment status refreshed: ${paymentStatus.paymentStatus}`,
      })
    } catch (error) {
      console.error("Error refreshing payment status:", error)
      toast({
        title: "Error",
        description: "Failed to refresh payment status.",
        variant: "destructive",
      })
    } finally {
      setRefreshingPayment(false)
    }
  }

  const getStatusProgress = (currentStatus: string) => {
    const statuses = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"]
    const currentIndex = statuses.indexOf(currentStatus)
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0
  }

  const PaymentStatusCard = ({ order }: { order: any }) => {
    const PaymentIcon = paymentMethodIcons[order.paymentMethod as keyof typeof paymentMethodIcons]
    const paymentMethodLabel = paymentMethodLabels[order.paymentMethod as keyof typeof paymentMethodLabels]

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <PaymentIcon className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Payment Method</h4>
              <div className="flex items-center gap-2 mb-2">
                <PaymentIcon className="h-4 w-4 text-green-600" />
                <span className="text-green-600">{paymentMethodLabel}</span>
              </div>
              <Badge
                variant="outline"
                className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-800">Payment Details</h4>
                {order.paymentMethod === "razorpay" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshPaymentStatus}
                    disabled={refreshingPayment}
                    className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingPayment ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                )}
              </div>

              {order.paymentMethod === "razorpay" && order.razorpayPayment ? (
                <div className="space-y-2 text-sm">
                  {order.razorpayPayment.paymentId && (
                    <div>
                      <span className="text-green-600">Payment ID:</span>
                      <p className="font-mono text-xs text-green-800 break-all">{order.razorpayPayment.paymentId}</p>
                    </div>
                  )}
                  {order.razorpayPayment.orderId && (
                    <div>
                      <span className="text-green-600">Razorpay Order ID:</span>
                      <p className="font-mono text-xs text-green-800 break-all">{order.razorpayPayment.orderId}</p>
                    </div>
                  )}
                </div>
              ) : order.paymentMethod === "cod" ? (
                <div className="text-sm text-green-600">
                  <p>Payment will be collected upon delivery</p>
                  {order.paymentStatus === "paid" && (
                    <p className="text-green-800 font-medium mt-1">✓ Payment received</p>
                  )}
                </div>
              ) : (
                <div className="text-sm text-green-600">
                  <p>Payment processed via {paymentMethodLabel}</p>
                </div>
              )}

              {order.paymentStatus === "failed" && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Payment Failed</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Your payment could not be processed. Please contact support for assistance.
                  </p>
                </div>
              )}

              {order.paymentStatus === "refunded" && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Payment Refunded</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    Your payment has been refunded. It may take 3-5 business days to reflect in your account.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-green-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4">Track Your Order</h1>
          <p className="text-lg text-green-600">
            Enter your order number to get real-time updates on your wellness products and payment status
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-green-800 mb-2">
                    Order Number
                  </label>
                  <Input
                    id="orderNumber"
                    placeholder="Enter your order number (e.g., ORD-123456)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="border-green-200 focus-visible:ring-emerald-600"
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                </div>
                <Button
                  onClick={handleTrackOrder}
                  disabled={loading}
                  className="w-full bg-green-800 hover:bg-green-900 text-white"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? "Tracking..." : "Track Order"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Not Found */}
        {notFound && (
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-red-200">
              <CardContent className="p-6 text-center">
                <div className="bg-red-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Order Not Found</h3>
                <p className="text-green-600 mb-4">
                  We couldn't find an order with the number "{orderNumber}". Please check your order number and try
                  again.
                </p>
                <p className="text-sm text-green-600">
                  Need help? Contact us at{" "}
                  <a href="tel:+919876543210" className="text-emerald-600 hover:underline">
                    +91 98765 43210
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-green-800">Order {order.orderNumber}</CardTitle>
                    <p className="text-green-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Customer</h4>
                    <p className="text-green-600">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-green-600 flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {order.customer.email}
                    </p>
                    <p className="text-green-600 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.customer.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Delivery Address</h4>
                    <p className="text-green-600 flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.customer.address}
                        <br />
                        {order.customer.city}, {order.customer.state} {order.customer.pincode}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Order Total</h4>
                    <p className="text-2xl font-bold text-emerald-600">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status Card */}
            <PaymentStatusCard order={order} />

            {/* Order Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"].map(
                    (status, index) => {
                      const Icon = statusIcons[status as keyof typeof statusIcons]
                      const label = statusLabels[status as keyof typeof statusLabels]
                      const isCompleted = Object.keys(statusLabels).indexOf(order.status) >= index
                      const isCurrent = order.status === status
                      const isLast = index === 5

                      return (
                        <div key={status} className="relative flex items-start">
                          {/* Timeline Line */}
                          {!isLast && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200">
                              <div 
                                className={`w-full transition-all duration-500 ${
                                  isCompleted ? "bg-emerald-600 h-full" : "bg-gray-200 h-0"
                                }`}
                              ></div>
                            </div>
                          )}
                          
                          {/* Timeline Node */}
                          <div className="flex-shrink-0 relative z-10">
                            <div
                              className={`
                                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                                ${isCompleted 
                                  ? "bg-emerald-600 text-white shadow-lg" 
                                  : "bg-gray-200 text-gray-500"
                                }
                                ${isCurrent 
                                  ? "ring-4 ring-emerald-100 scale-110 shadow-xl" 
                                  : ""
                                }
                              `}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                          </div>
                          
                          {/* Timeline Content */}
                          <div className="ml-6 flex-1">
                            <div 
                              className={`
                                p-4 rounded-lg border-2 transition-all duration-300
                                ${isCompleted 
                                  ? "bg-emerald-50 border-emerald-200" 
                                  : "bg-gray-50 border-gray-200"
                                }
                                ${isCurrent 
                                  ? "shadow-md border-emerald-300 bg-emerald-100" 
                                  : ""
                                }
                              `}
                            >
                              <h4 
                                className={`font-semibold text-sm ${
                                  isCompleted ? "text-emerald-800" : "text-gray-600"
                                }`}
                              >
                                {label}
                              </h4>
                              <p 
                                className={`text-xs mt-1 ${
                                  isCompleted ? "text-emerald-600" : "text-gray-500"
                                }`}
                              >
                                {status === "pending" && "Your order has been placed successfully"}
                                {status === "confirmed" && "Order confirmed and payment verified"}
                                {status === "preparing" && "Your wellness products are being prepared"}
                                {status === "ready" && "Order is ready for pickup or dispatch"}
                                {status === "out_for_delivery" && "Your order is on the way"}
                                {status === "delivered" && "Order delivered successfully"}
                              </p>
                              {isCurrent && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white">
                                    Current Status
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">{item.name}</h4>
                            <p className="text-green-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-green-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      {index < order.items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-green-600">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Tax</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-green-800">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Delivery */}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Estimated Delivery</h4>
                      <p className="text-green-600">
                        {order.status === "out_for_delivery"
                          ? "Your Ayurvedic oils and shampoo are on the way! Expected delivery within 2-3 business days."
                          : order.status === "ready"
                            ? "Your premium Ayurvedic products are ready for dispatch. Expected delivery in 3-5 business days."
                            : order.status === "preparing"
                              ? "Your natural oils and shampoo are being carefully prepared and quality checked. Expected delivery in 4-6 business days."
                              : "Your Ayurvedic wellness products will be processed and shipped within 1-2 business days."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
