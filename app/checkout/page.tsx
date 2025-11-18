"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Landmark, Check, Tag, X, Percent, Wallet } from "lucide-react"
import { api } from "@/lib/api"
import { CakeLoading } from "@/components/cake-loading"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface AppliedCoupon {
  id: string
  code: string
  discountAmount: number
  discountType: "percentage" | "fixed"
  discountValue: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const [razorpayConfig, setRazorpayConfig] = useState<any>(null)
  const [couriers, setCouriers] = useState<any[]>([])
  const [selectedCourier, setSelectedCourier] = useState<any>(null)
  const [loadingCouriers, setLoadingCouriers] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
    notes: "",
  })

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          setIsRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    const loadRazorpayConfig = async () => {
      try {
        const config = await api.payment.getConfig()
        setRazorpayConfig(config)
      } catch (error) {
        console.error("Error loading Razorpay config:", error)
        toast({
          title: "Payment Setup Error",
          description: "Failed to load payment configuration. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    if (!window.Razorpay) {
      loadRazorpayScript()
    } else {
      setIsRazorpayLoaded(true)
    }

    loadRazorpayConfig()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Auto-fetch city and state, then couriers when pincode changes
    if (name === 'pincode' && value.length === 6) {
      fetchPincodeData(value)
    }
  }

  const fetchPincodeData = async (pincode: string) => {
    try {
      const response = await fetch(`/api/pincode?pincode=${pincode}`)
      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          city: result.city,
          state: result.state
        }))
        
        // Fetch couriers after setting city/state
        fetchCouriers(pincode)
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error)
      // Still fetch couriers even if pincode lookup fails
      fetchCouriers(pincode)
    }
  }

  const fetchCouriers = async (pincode: string) => {
    setLoadingCouriers(true)
    try {
      const response = await fetch('/api/shipping/serviceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_postcode: parseInt(pincode),
          weight: 0.5,
          cod: paymentMethod === 'cod' ? 1 : 0,
          declared_value: totals.total
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setCouriers(result.couriers)
        // Auto-select recommended courier
        const recommended = result.couriers.find((c: any) => c.id === result.recommended_courier_id)
        if (recommended) {
          setSelectedCourier(recommended)
        }
      }
    } catch (error) {
      console.error('Error fetching couriers:', error)
    } finally {
      setLoadingCouriers(false)
    }
  }

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    setIsValidatingCoupon(true)

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: totalPrice,
        }),
      })

      const result = await response.json()

      if (result.valid && result.coupon && result.discountAmount) {
        setAppliedCoupon({
          id: result.coupon._id,
          code: result.coupon.code,
          discountAmount: result.discountAmount,
          discountType: result.coupon.discountType,
          discountValue: result.coupon.discountValue,
        })
        setCouponCode("")
        toast({
          title: "Coupon Applied!",
          description: `You saved ₹${result.discountAmount.toFixed(2)} with coupon ${result.coupon.code}`,
          variant: "default",
        })
      } else {
        toast({
          title: "Invalid Coupon",
          description: result.error || "This coupon is not valid",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      toast({
        title: "Error",
        description: "Failed to validate coupon. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order",
      variant: "default",
    })
  }

  const calculateTotals = () => {
    const subtotal = totalPrice
    const deliveryFee = selectedCourier ? selectedCourier.rate : 0
    const tax = 0
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
    const total = subtotal + deliveryFee - discount

    return {
      subtotal,
      deliveryFee,
      tax,
      discount,
      total: Math.max(total, 0), // Ensure total is never negative
    }
  }

  const totals = calculateTotals()

  const processRazorpayPayment = async (orderData: any) => {
    try {
      if (!razorpayConfig) {
        throw new Error("Payment configuration not loaded")
      }

      // Create Razorpay order
      const razorpayOrder = await api.payment.createOrder(totals.total, `order_${Date.now()}`)

      const options = {
        key: razorpayConfig.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: razorpayConfig.name,
        description: razorpayConfig.description,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Create order only after successful payment
            const order = await api.orders.create({
              ...orderData,
              paymentMethod: "razorpay",
              razorpayPayment: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                status: "captured",
              },
            })
            
            // Mark coupon as used if applicable
            if (appliedCoupon) {
              fetch(`/api/coupons/${appliedCoupon.id}/use`, {
                method: "POST",
              }).catch(error => console.error("Error marking coupon as used:", error))
            }
            
            clearCart()
            
            const params = new URLSearchParams({
              orderNumber: order.orderNumber,
              orderId: order._id || order.id || "",
            })
            
            router.push(`/order-success?${params.toString()}`)
          } catch (error) {
            console.error("Error creating order after payment:", error)
            toast({
              title: "Order Creation Failed",
              description: "Payment successful but order creation failed. Please contact support.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: razorpayConfig.theme,
        modal: {
          ondismiss: () => {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process.",
              variant: "destructive",
            })
            setIsSubmitting(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Razorpay payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "pincode", "state"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData].trim())

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (paymentMethod === "razorpay" && (!isRazorpayLoaded || !razorpayConfig)) {
      toast({
        title: "Payment Gateway Loading",
        description: "Please wait for the payment gateway to load and try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate courier selection
    if (formData.pincode.length === 6 && couriers.length > 0 && !selectedCourier) {
      toast({
        title: "Select Delivery Option",
        description: "Please select a delivery option to continue.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
          state: formData.state.trim(),
        },
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        paymentMethod: "razorpay",
        notes: formData.notes.trim(),
        coupon: appliedCoupon
          ? {
              id: appliedCoupon.id,
              code: appliedCoupon.code,
              discountAmount: appliedCoupon.discountAmount,
            }
          : undefined,
        selectedCourier: selectedCourier
          ? {
              id: selectedCourier.id,
              name: selectedCourier.name,
              rate: selectedCourier.rate,
              estimated_delivery_days: selectedCourier.estimated_delivery_days,
              etd: selectedCourier.etd,
            }
          : undefined,
      }

      if (paymentMethod === "razorpay") {
        await processRazorpayPayment(orderData)
        return
      }

      // Handle other payment methods (existing logic)
      console.log("Creating order with data:", orderData)
      const order = await api.orders.create(orderData)
      console.log("Order created:", order)

      // If coupon was used, mark it as used
      if (appliedCoupon) {
        try {
          await fetch(`/api/coupons/${appliedCoupon.id}/use`, {
            method: "POST",
          })
        } catch (error) {
          console.error("Error marking coupon as used:", error)
        }
      }

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${order.orderNumber} has been placed. You will receive a confirmation shortly.`,
        variant: "default",
      })

      clearCart()

      // Navigate with both orderNumber and orderId
      const params = new URLSearchParams({
        orderNumber: order.orderNumber,
        orderId: order._id || order.id || "",
      })

      router.push(`/order-success?${params.toString()}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-[#FFF9F0] rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-[#D4915D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#8B4513]">Your cart is empty</h1>
          <p className="mt-4 text-[#A67C52]">Please add some items to your cart before proceeding to checkout.</p>
          <Link href="/menu">
            <Button className="mt-6 bg-[#D4915D] hover:bg-[#C17A45] text-white">Browse Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        <CakeLoading size="lg" message="Processing your order..." />
      </div>
    )
  }

  return (
    <div className="bg-[#FFF9F0] py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-[#8B4513] hover:text-[#D4915D] hover:bg-[#FFF9F0]"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>

        <motion.h1
          className="text-3xl font-bold text-[#8B4513] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Checkout
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#8B4513] mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-[#8B4513]">
                        First Name*
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-[#8B4513]">
                        Last Name*
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#8B4513]">
                        Email*
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#8B4513]">
                        Phone*
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#8B4513] mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-[#8B4513]">
                        Address*
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pincode" className="text-[#8B4513]">
                          Pincode*
                        </Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                          maxLength={6}
                          placeholder="Enter 6-digit pincode"
                          className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-[#8B4513]">
                          City* <span className="text-xs text-[#A67C52]">(Auto-filled)</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          readOnly
                          required
                          className="mt-1 border-[#E8DCCA] bg-gray-50 text-gray-700"
                          placeholder="Will be filled automatically"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-[#8B4513]">
                          State* <span className="text-xs text-[#A67C52]">(Auto-filled)</span>
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          readOnly
                          required
                          className="mt-1 border-[#E8DCCA] bg-gray-50 text-gray-700"
                          placeholder="Will be filled automatically"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Selection */}
              {formData.pincode.length === 6 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-[#8B4513] mb-4">Select Delivery Option</h2>
                    {loadingCouriers ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4915D]" />
                        <span className="ml-2 text-[#8B4513]">Loading delivery options...</span>
                      </div>
                    ) : couriers.length > 0 ? (
                      <RadioGroup 
                        value={selectedCourier?.id?.toString()} 
                        onValueChange={(value) => {
                          const courier = couriers.find(c => c.id.toString() === value)
                          setSelectedCourier(courier)
                        }}
                        className="space-y-3"
                      >
                        {couriers.map((courier) => (
                          <div key={courier.id} className="flex items-center space-x-3 p-3 border border-[#E8DCCA] rounded-lg hover:bg-[#FFF9F0]">
                            <RadioGroupItem value={courier.id.toString()} id={`courier-${courier.id}`} className="text-[#D4915D]" />
                            <Label htmlFor={`courier-${courier.id}`} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-[#8B4513]">{courier.name}</div>
                                  <div className="text-sm text-[#A67C52]">
                                    Delivery in {courier.estimated_delivery_days} days • Expected by {courier.etd}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-[#D4915D]">₹{courier.rate}</div>
                                  {courier.rating && (
                                    <div className="text-xs text-[#A67C52]">★ {courier.rating}</div>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-8 text-[#A67C52]">
                        No delivery options available for this pincode
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#8B4513] mb-4">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="razorpay" id="razorpay" className="text-[#D4915D]" />
                      <Label htmlFor="razorpay" className="flex items-center cursor-pointer">
                        <Wallet className="h-5 w-5 mr-2 text-[#D4915D]" />
                        <span>Online Payment</span>
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Secure</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "razorpay" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Secure Online Payment</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Pay securely using Credit/Debit Cards, Net Banking, UPI, or Digital Wallets. Your payment
                        information is encrypted and secure.
                      </p>
                      {(!isRazorpayLoaded || !razorpayConfig) && (
                        <div className="mt-2 flex items-center gap-2 text-amber-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600" />
                          <span className="text-sm">Loading payment gateway...</span>
                        </div>
                      )}
                    </div>
                  )}


                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#8B4513] mb-4">Additional Information</h2>
                  <div>
                    <Label htmlFor="notes" className="text-[#8B4513]">
                      Order Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Special instructions for delivery or order"
                      className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                    />
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#8B4513] mb-4">Order Summary</h2>
                <div className="max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 mb-4">
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
                        <h3 className="font-medium text-[#8B4513]">{item.name}</h3>
                        <div className="flex justify-between text-[#A67C52] text-sm">
                          <span>
                            ₹{item.price.toFixed(2)} x {item.quantity}
                          </span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Coupon Section */}
                <div className="mb-4">
                  <Label htmlFor="couponCode" className="text-[#8B4513] mb-2 block">
                    Have a coupon code?
                  </Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                        onKeyPress={(e) => e.key === "Enter" && validateCoupon()}
                      />
                      <Button
                        type="button"
                        onClick={validateCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="bg-[#D4915D] hover:bg-[#C17A45] text-white px-4"
                      >
                        {isValidatingCoupon ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Tag className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                        <span className="text-green-600 text-sm">(-₹{appliedCoupon.discountAmount.toFixed(2)})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Subtotal ({totalItems} items)</span>
                    <span className="text-[#8B4513]">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {selectedCourier && (
                    <div className="flex justify-between">
                      <span className="text-[#A67C52]">Delivery ({selectedCourier.name})</span>
                      <span className="text-[#8B4513]">₹{totals.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}

                  {totals.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold mb-6">
                  <span className="text-[#8B4513]">Total</span>
                  <span className="text-[#D4915D]">₹{totals.total.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-[#8B4513] hover:bg-[#7A3A0D] text-white"
                  disabled={isSubmitting || (paymentMethod === "razorpay" && (!isRazorpayLoaded || !razorpayConfig))}
                  onClick={(e) => {
                    if (paymentMethod === "razorpay" && !isSubmitting) {
                      alert("After completing the payment, please wait for the confirmation message. Do not close the browser or navigate away until you see the order confirmation.")
                    }
                  }}
                >
                  {isSubmitting ? "Processing..." : paymentMethod === "razorpay" ? "Pay Online" : "Place Order"}
                </Button>

                <p className="text-xs text-[#A67C52] text-center mt-4">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
