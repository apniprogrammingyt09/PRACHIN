"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Phone, Mail, RefreshCw, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"

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

function TrackingSection({ orderId }: { orderId: string }) {
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(true)

  const fetchTracking = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shipping/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      const result = await response.json()
      
      if (result.ready) {
        setTracking(result.tracking)
        setReady(true)
      } else {
        setReady(false)
      }
    } catch (error) {
      console.error('Error fetching tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="text-center py-4 text-[#A67C52]">
        Order is not ready for tracking yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button 
        onClick={fetchTracking}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Package className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Loading...' : 'Track Shipment'}
      </Button>
      
      {tracking && (
        <div className="bg-[#FFF9F0] p-4 rounded-lg border border-[#E8DCCA] space-y-4">
          {/* Shipment Overview */}
          {tracking.shipment_track?.[0] && (
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-[#8B4513] mb-2">Current Status</div>
              <div className="text-lg font-semibold text-green-700">
                {tracking.shipment_track[0].current_status}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-[#A67C52]">
                <div>AWB: {tracking.shipment_track[0].awb_code}</div>
                <div>Weight: {tracking.shipment_track[0].weight}kg</div>
                <div>Origin: {tracking.shipment_track[0].origin}</div>
                <div>Destination: {tracking.shipment_track[0].destination}</div>
                {tracking.shipment_track[0].edd && (
                  <div className="col-span-2">EDD: {new Date(tracking.shipment_track[0].edd).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}
          
          {/* Tracking Activities */}
          {tracking.shipment_track_activities && tracking.shipment_track_activities.length > 0 && (
            <div>
              <div className="font-medium text-[#8B4513] mb-2">Tracking Timeline</div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tracking.shipment_track_activities.map((activity: any, index: number) => (
                  <div key={index} className="flex gap-3 p-3 bg-white rounded border-l-4 border-green-400">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium text-[#8B4513]">{activity.activity}</div>
                      <div className="text-sm text-[#A67C52] mt-1">
                        📍 {activity.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Track URL */}
          {tracking.track_url && (
            <div className="text-center">
              <a 
                href={tracking.track_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Track on Shiprocket →
              </a>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        <Button 
          onClick={async () => {
            try {
              const response = await fetch('/api/shipping/invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
              })
              const result = await response.json()
              if (result.success && result.invoiceResult.invoice_url) {
                window.open(result.invoiceResult.invoice_url, '_blank')
              } else {
                alert('Failed to generate invoice')
              }
            } catch (error) {
              alert('Error generating invoice')
            }
          }}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Print Invoice
        </Button>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await api.orders.getById(params.id as string)
        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-800">Order not found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-800">Order Details</h1>
          <p className="text-green-600">Order #{order.orderNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-green-200 rounded-lg">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          item.image && item.image.startsWith("data:")
                            ? item.image
                            : item.image
                              ? `data:image/jpeg;base64,${item.image}`
                              : "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={item.image ? true : false}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-green-800">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-green-600">₹{item.price} x {item.quantity}</span>
                        <span className="font-medium text-green-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Name</span>
                  </div>
                  <p className="text-green-800">{order.customer?.firstName} {order.customer?.lastName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-green-800">{order.customer?.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Phone</span>
                  </div>
                  <p className="text-green-800">{order.customer?.phone}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Address</span>
                  </div>
                  <p className="text-green-800">
                    {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-green-600">Subtotal</span>
                <span className="text-green-800">₹{order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span className="text-green-800">Total</span>
                <span className="text-green-800">₹{order.total?.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-green-600 font-medium">Status</span>
                <div className="mt-1">
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-green-600 font-medium">Payment Status</span>
                <div className="mt-1">
                  <Badge variant="outline" className={`${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Order Date</span>
              </div>
              <p className="text-green-800">{new Date(order.createdAt).toLocaleDateString()}</p>
              
              {order.razorpayPayment?.paymentId && (
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Payment ID</span>
                  </div>
                  <p className="text-green-800 text-sm break-all">{order.razorpayPayment.paymentId}</p>
                </div>
              )}
              
              {order.selectedCourier && (
                <div>
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Selected Courier</span>
                  </div>
                  <p className="text-green-800">
                    {typeof order.selectedCourier === 'object' 
                      ? order.selectedCourier.name 
                      : order.selectedCourier}
                  </p>
                  {typeof order.selectedCourier === 'object' && order.selectedCourier.rate && (
                    <p className="text-sm text-green-600">Rate: ₹{order.selectedCourier.rate}</p>
                  )}
                </div>
              )}
              
              {order.status === 'confirmed' && !order.shiprocket?.orderId && (
                <Button 
                  onClick={() => router.push(`/admin/orders/${order._id}/shipment`)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Ship Order
                </Button>
              )}
              
              {order.shiprocket?.orderId && (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Shiprocket Order ID:</span>
                    <p className="text-green-800">{order.shiprocket.orderId}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Shipment ID:</span>
                    <p className="text-green-800">{order.shiprocket.shipmentId}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Status:</span>
                    <p className="text-green-800">{order.shiprocket.status}</p>
                  </div>
                  <TrackingSection orderId={order._id} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}