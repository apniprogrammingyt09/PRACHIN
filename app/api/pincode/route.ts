import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get('pincode')
    
    if (!pincode || pincode.length !== 6) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
    }

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const data = await response.json()
    
    if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
      const postOffice = data[0].PostOffice[0]
      return NextResponse.json({
        success: true,
        city: postOffice.District,
        state: postOffice.State,
        area: postOffice.Name
      })
    }
    
    return NextResponse.json({ error: 'Pincode not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pincode data' }, { status: 500 })
  }
}