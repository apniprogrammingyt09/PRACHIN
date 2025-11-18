"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

export default function CreateShipmentPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dimensions, setDimensions] = useState({
    length: 10,
    breadth: 10,
    height: 5,
    weight: 0.5
  })

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await api.orders.getById(params.id as string)
        setOrder(orderData)
        
        // Auto-populate dimensions from first product if available
        if (orderData.items && orderData.items.length > 0) {
          const firstItem = orderData.items[0]
          if (firstItem.packageLength || firstItem.packageBreadth || firstItem.packageHeight || firstItem.packageWeight) {
            setDimensions({
              length: parseFloat(firstItem.packageLength) || 10,
              breadth: parseFloat(firstItem.packageBreadth) || 10,
              height: parseFloat(firstItem.packageHeight) || 5,
              weight: parseFloat(firstItem.packageWeight) || 0.5
            })
          }
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const handleCreateShipment = async () => {
    setCreating(true)
    try {
      const response = await fetch('/api/shipping/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: params.id,
          ...dimensions
        })
      })
      
      const result = await response.json()
      
      if (response.ok && result.createResult?.order_id) {
        alert(`Shipment created successfully! Order ID: ${result.createResult.order_id}`)
        router.push(`/admin/orders/${params.id}`)
      } else {
        alert(`Error: ${result.error || 'Failed to create shipment'}`)
      }
    } catch (error) {
      alert('Network error occurred')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-800">Ship Order</h1>
          <p className="text-green-600">Order #{order?.orderNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Package Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Length (cm)</Label>
              <Input 
                type="number" 
                value={dimensions.length.toString()}
                onChange={(e) => setDimensions({...dimensions, length: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label>Breadth (cm)</Label>
              <Input 
                type="number" 
                value={dimensions.breadth.toString()}
                onChange={(e) => setDimensions({...dimensions, breadth: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input 
                type="number" 
                value={dimensions.height.toString()}
                onChange={(e) => setDimensions({...dimensions, height: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input 
              type="number" 
              step="0.1"
              value={dimensions.weight.toString()}
              onChange={(e) => setDimensions({...dimensions, weight: parseFloat(e.target.value) || 0})}
            />
          </div>
          <Button 
            onClick={handleCreateShipment}
            disabled={creating}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {creating ? "Creating Shipment..." : "Create Shipment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}