import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { delivery_postcode, weight = 0.5, cod = 1, declared_value } = await request.json()
    
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

    // Check serviceability
    const params = new URLSearchParams({
      pickup_postcode: '132116',
      delivery_postcode: delivery_postcode.toString(),
      cod: cod.toString(),
      weight: weight.toString(),
      declared_value: declared_value?.toString() || '100'
    })
    
    const serviceabilityResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authResult.token}`
      }
    })

    const serviceabilityResult = await serviceabilityResponse.json()
    
    if (serviceabilityResult.status === 200) {
      const couriers = serviceabilityResult.data.available_courier_companies.map((courier: any) => ({
        id: courier.courier_company_id,
        name: courier.courier_name,
        rate: courier.rate,
        freight_charge: courier.freight_charge,
        cod_charges: courier.cod_charges,
        estimated_delivery_days: courier.estimated_delivery_days,
        etd: courier.etd,
        rating: courier.rating,
        is_surface: courier.is_surface,
        min_weight: courier.min_weight
      }))

      return NextResponse.json({
        success: true,
        couriers,
        recommended_courier_id: serviceabilityResult.data.recommended_courier_company_id
      })
    }

    return NextResponse.json({ error: 'Failed to fetch couriers', details: serviceabilityResult }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check serviceability', details: error.message }, { status: 500 })
  }
}