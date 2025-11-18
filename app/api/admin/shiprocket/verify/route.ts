import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Verifying credentials:', { email, passwordLength: password?.length })
    
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const result = await response.json()
    console.log('Shiprocket response:', { status: response.status, result })
    
    if (result.token) {
      return NextResponse.json({ success: true, message: 'Credentials verified successfully' })
    } else {
      const message = result.message === 'User blocked due to too many failed login attempts.' 
        ? 'Account temporarily blocked. Please wait 15-30 minutes and try again.'
        : `Authentication failed: ${result.message || 'Invalid credentials'}`
      
      return NextResponse.json({ 
        success: false, 
        message,
        details: result
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 })
  }
}