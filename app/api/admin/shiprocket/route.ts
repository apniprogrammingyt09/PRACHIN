import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const settings = await db.collection('shiprocket_settings').findOne({})
    
    return NextResponse.json({
      email: settings?.email || '',
      password: settings?.password || ''
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const db = await getDatabase()
    
    await db.collection('shiprocket_settings').replaceOne(
      {},
      { email, password, updatedAt: new Date() },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}