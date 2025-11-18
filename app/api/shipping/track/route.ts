import { NextRequest, NextResponse } from 'next/server'
import { orderService } from '@/lib/services/orderService'
import { getDatabase } from '@/lib/mongodb'

const statusMap: { [key: number]: string } = {
  6: 'Shipped',
  7: 'Delivered',
  8: 'Canceled',
  9: 'RTO Initiated',
  10: 'RTO Delivered',
  12: 'Lost',
  13: 'Pickup Error',
  14: 'RTO Acknowledged',
  15: 'Pickup Rescheduled',
  16: 'Cancellation Requested',
  17: 'Out For Delivery',
  18: 'In Transit',
  19: 'Out For Pickup',
  20: 'Pickup Exception',
  21: 'Undelivered',
  22: 'Delayed',
  23: 'Partial Delivered',
  24: 'Destroyed',
  25: 'Damaged',
  26: 'Fulfilled',
  27: 'Pickup Booked',
  38: 'Reached At Destination Hub',
  39: 'Misrouted',
  40: 'RTO NDR',
  41: 'RTO OFD',
  42: 'Picked Up',
  43: 'Self Fulfilled',
  44: 'Disposed Off',
  45: 'Cancelled Before Dispatched',
  46: 'RTO In Transit',
  47: 'QC Failed',
  48: 'Reached Warehouse',
  49: 'Custom Cleared',
  50: 'In Flight',
  51: 'Handover to Courier',
  52: 'Shipment Booked',
  54: 'In Transit Overseas',
  55: 'Connection Aligned',
  56: 'Reached Overseas Warehouse',
  57: 'Custom Cleared Overseas',
  59: 'Box Packing',
  60: 'FC Allocated',
  61: 'Picklist Generated',
  62: 'Ready To Pack',
  63: 'Packed',
  67: 'FC Manifest Generated',
  68: 'Processed At Warehouse',
  71: 'Handover Exception',
  72: 'Packed Exception',
  75: 'RTO Lock',
  76: 'Untraceable',
  77: 'Issue Related To Recipient',
  78: 'Reached Back At Seller City'
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    const order = await orderService.getOrderById(orderId)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.shiprocket?.shipmentId) {
      return NextResponse.json({ 
        ready: false, 
        message: 'Order is not ready for tracking yet. Shipment not created.' 
      })
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

    // Track shipment
    const trackResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${order.shiprocket.shipmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authResult.token}`
      }
    })

    const trackResult = await trackResponse.json()
    console.log('Shiprocket tracking response:', JSON.stringify(trackResult, null, 2))
    
    // Process tracking data
    if (trackResult.tracking_data) {
      const trackingData = trackResult.tracking_data
      const processedData = {
        ...trackingData,
        track_status_name: statusMap[trackingData.shipment_status] || trackingData.shipment_track?.[0]?.current_status || 'In Transit',
        current_status_name: trackingData.shipment_track?.[0]?.current_status || 'Processing',
        expected_delivery_date: trackingData.etd,
        shipment_track: trackingData.shipment_track_activities?.map((track: any) => ({
          ...track,
          status_name: track.activity || statusMap[parseInt(track['sr-status'])] || 'Update',
          current_status: track['sr-status']
        })) || []
      }
      
      return NextResponse.json({
        ready: true,
        tracking: processedData
      })
    }

    console.log('No tracking_data found, returning raw result:', trackResult)
    return NextResponse.json({
      ready: true,
      tracking: trackResult,
      message: 'No tracking data available yet'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track shipment', details: error.message }, { status: 500 })
  }
}