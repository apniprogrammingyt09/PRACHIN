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
    const deliveryFee = 40
    const tax = subtotal * 0.05
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
    const total = subtotal + deliveryFee + tax - discount

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

      // Create order in database first with pending payment
      const order = await api.orders.create({
        ...orderData,
        paymentMethod: "razorpay",
        razorpayPayment: {
          orderId: razorpayOrder.id,
        },
      })

      const options = {
        key: razorpayConfig.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: razorpayConfig.name,
        description: razorpayConfig.description,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verificationResult = await api.payment.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id,
            })

            if (verificationResult.success) {
              // Mark coupon as used if applicable
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
                title: "Payment Successful!",
                description: `Your order ${order.orderNumber} has been placed successfully.`,
                variant: "default",
              })

              clearCart()

              // Navigate to success page
              const params = new URLSearchParams({
                orderNumber: order.orderNumber,
                orderId: order._id || order.id || "",
              })

              router.push(`/order-success?${params.toString()}`)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment. Please contact support.",
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
        paymentMethod: paymentMethod as "cod" | "razorpay",
        notes: formData.notes.trim(),
        coupon: appliedCoupon
          ? {
              id: appliedCoupon.id,
              code: appliedCoupon.code,
              discountAmount: appliedCoupon.discountAmount,
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
                        <Label htmlFor="city" className="text-[#8B4513]">
                          City*
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                        />
                      </div>
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
                          className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-[#8B4513]">
                          State*
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="mt-1 border-[#E8DCCA] focus-visible:ring-[#D4915D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#8B4513] mb-4">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" className="text-[#D4915D]" />
                      <Label htmlFor="cod" className="flex items-center cursor-pointer">
                        <Landmark className="h-5 w-5 mr-2 text-[#D4915D]" />
                        <span>Cash on Delivery</span>
                      </Label>
                    </div>
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

                  {paymentMethod === "cod" && (
                    <div className="mt-6 p-4 bg-[#FFF9F0] rounded-lg">
                      <p className="text-[#A67C52]">
                        Please keep the exact amount ready at the time of delivery. Our delivery person will provide you
                        with a receipt.
                      </p>
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
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Delivery Fee</span>
                    <span className="text-[#8B4513]">₹{totals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Tax</span>
                    <span className="text-[#8B4513]">₹{totals.tax.toFixed(2)}</span>
                  </div>
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
