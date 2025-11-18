import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/services/orderService'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { orderId, length, breadth, height, weight } = await request.json()
    const order = await orderService.getOrderById(orderId)
    
    if (!order || order.status !== 'confirmed') {
      return NextResponse.json({ error: 'Order not found or not confirmed' }, { status: 404 })
    }

    const calculatedSubtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const shiprocketOrder = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().split('T')[0] + ' ' + order.createdAt.toTimeString().slice(0, 5),
      pickup_location: "Home",
      comment: order.notes || "",
      billing_customer_name: order.customer.firstName,
      billing_last_name: order.customer.lastName,
      billing_address: order.customer.address,
      billing_address_2: "",
      billing_city: order.customer.city,
      billing_pincode: parseInt(order.customer.pincode),
      billing_state: order.customer.state,
      billing_country: "India",
      billing_email: order.customer.email,
      billing_phone: parseInt(order.customer.phone),
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: order.items.map(item => ({
        name: item.name,
        sku: item.productId,
        units: item.quantity,
        selling_price: item.price,
        discount: "",
        tax: "",
        hsn: 441122
      })),
      payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: calculatedSubtotal,
      length,
      breadth,
      height,
      weight
    }

    // Get credentials from database
    const db = await getDatabase()
    const settings = await db.collection('shiprocket_settings').findOne({})
    
    if (!settings?.email || !settings?.password) {
      return NextResponse.json({ error: 'Shiprocket credentials not configured' }, { status: 500 })
    }
    
    const shiprocketEmail = settings.email
    const shiprocketPassword = settings.password

    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: shiprocketEmail,
        password: shiprocketPassword
      })
    })

    const token = await authResponse.json()
    
    if (!token.token) {
      return NextResponse.json({ error: 'Authentication failed', details: token }, { status: 401 })
    }

    const orderResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.token}`
      },
      body: JSON.stringify(shiprocketOrder)
    })

    const createResult = await orderResponse.json()
    
    if (createResult.order_id) {
      // If order has selected courier, assign AWB immediately
      let awbResult = null
      if (order.selectedCourier?.id) {
        try {
          const awbResponse = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.token}`
            },
            body: JSON.stringify({
              shipment_id: createResult.shipment_id,
              courier_id: order.selectedCourier.id
            })
          })
          awbResult = await awbResponse.json()
        } catch (error) {
          console.error('Error assigning AWB:', error)
        }
      }
      
      // Store complete Shiprocket response in order
      await orderService.updateShiprocketData(orderId, {
        orderId: createResult.order_id,
        shipmentId: createResult.shipment_id,
        status: createResult.status,
        statusCode: createResult.status_code,
        onboardingCompletedNow: createResult.onboarding_completed_now,
        awbCode: awbResult?.response?.data?.awb_code || createResult.awb_code,
        courierCompanyId: awbResult?.response?.data?.courier_company_id || order.selectedCourier?.id || createResult.courier_company_id,
        courierName: awbResult?.response?.data?.courier_name || order.selectedCourier?.name || createResult.courier_name,
        trackingUrl: createResult.order_id ? `https://shiprocket.co/tracking/${createResult.order_id}` : null,
        fullResponse: createResult,
        awbResponse: awbResult
      })
    }
    
    return NextResponse.json({
      success: true,
      createResult
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shipment', details: error.message }, { status: 500 })
  }
}