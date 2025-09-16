"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, Home, Download, Loader2 } from "lucide-react"
import { useState } from "react"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")
  const orderId = searchParams.get("orderId")
  const [isDownloading, setIsDownloading] = useState(false)

  // Generate a fallback order number if none provided
  const displayOrderNumber = orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  const handleDownloadInvoice = async () => {
    if (!orderId) return

    setIsDownloading(true)
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response = await fetch(`/api/invoice/${orderId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice-${displayOrderNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Failed to download invoice")
        alert("Failed to download invoice. Please try again.")
      }
    } catch (error) {
      console.error("Error downloading invoice:", error)
      alert("Error downloading invoice. Please check your connection and try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-[#FFF9F0] min-h-[80vh] flex items-center justify-center py-16">
      <div className="container max-w-md mx-auto px-4">
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <div className="bg-[#FEEBD7] rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-[#D4915D]" />
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-[#2D5016] mb-2">Order Placed Successfully!</h1>
          <p className="text-[#4A7C59] mb-6">Thank you for your order. We're preparing your Ayurvedic products!</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-[#2D5016] font-medium">Order Number:</p>
            <p className="text-[#4A7C59] font-bold text-xl">{displayOrderNumber}</p>
            {orderId && (
              <>
                <p className="text-[#2D5016] font-medium mt-2">Order ID:</p>
                <p className="text-[#4A7C59] text-sm">{orderId}</p>
              </>
            )}
            <p className="text-[#4A7C59] text-sm mt-2">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>

          {orderId && (
            <div className="mb-6">
              <Button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="w-full bg-[#4A7C59] hover:bg-[#2D5016] text-white relative"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Invoice...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </Button>
              {isDownloading && (
                <div className="mt-2 text-center">
                  <div className="text-sm text-[#4A7C59] mb-2">Please wait while we prepare your invoice</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#4A7C59] h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-[#2D5016]">
              You can track your order status in the <span className="font-medium">Track Order</span> section.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="w-full bg-[#2D5016] hover:bg-[#1A3009] text-white">
                  <Home className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button
                  variant="outline"
                  className="w-full border-[#4A7C59] text-[#4A7C59] hover:bg-green-50 bg-transparent"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
            </div>

            {displayOrderNumber && (
              <div className="mt-4">
                <Link href={`/track?orderNumber=${displayOrderNumber}`}>
                  <Button
                    variant="outline"
                    className="w-full border-[#2D5016] text-[#2D5016] hover:bg-green-50 bg-transparent"
                  >
                    Track Your Order
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return <OrderSuccessContent />
}
