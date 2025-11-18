import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const settings = await db.collection('shiprocket_settings').findOne({})
    
    return NextResponse.json({
      hasSettings: !!settings,
      email: settings?.email || 'Not found',
      passwordLength: settings?.password?.length || 0,
      passwordPreview: settings?.password ? settings.password.substring(0, 3) + '...' : 'Not found'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}