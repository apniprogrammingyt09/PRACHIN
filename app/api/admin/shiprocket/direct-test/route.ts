import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const settings = await db.collection('shiprocket_settings').findOne({})
    
    if (!settings) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 })
    }

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: settings.email,
        password: settings.password
      })
    })

    const result = await response.json()
    
    return NextResponse.json({
      status: response.status,
      success: !!result.token,
      response: result,
      credentials: {
        email: settings.email,
        passwordLength: settings.password.length
      }
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}