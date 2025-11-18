import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/services/orderService'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    const order = await orderService.getOrderById(orderId)
    
    if (!order || !order.shiprocket?.orderId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const db = await getDatabase()
    const settings = await db.collection('shiprocket_settings').findOne({})
    
    if (!settings?.email || !settings?.password) {
      return NextResponse.json({ error: 'Shiprocket credentials not configured' }, { status: 500 })
    }

    // Authenticate
    const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: settings.email, password: settings.password })
    })

    const authResult = await authResponse.json()
    if (!authResult.token) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Generate invoice
    const invoiceResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/print/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authResult.token}`
      },
      body: JSON.stringify({
        ids: [order.shiprocket.orderId.toString()]
      })
    })

    const invoiceResult = await invoiceResponse.json()
    
    return NextResponse.json({
      success: true,
      invoiceResult
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate invoice', details: error.message }, { status: 500 })
  }
}