"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ShiprocketSettingsPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/shiprocket')
        const data = await response.json()
        setEmail(data.email || '')
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleVerify = async () => {
    setVerifying(true)
    try {
      // Get existing credentials from database
      const settingsResponse = await fetch('/api/admin/shiprocket')
      const settings = await settingsResponse.json()
      
      if (!settings.email || !settings.password) {
        alert('No existing credentials found. Please save credentials first.')
        return
      }
      
      // Verify existing credentials
      const response = await fetch('/api/admin/shiprocket/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: settings.email, 
          password: settings.password
        })
      })
      
      const result = await response.json()
      if (response.ok) {
        alert('✅ Existing credentials are valid!')
      } else {
        alert('❌ Existing credentials are invalid. Please update them.')
      }
    } catch (error) {
      alert('Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/shiprocket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (response.ok) {
        alert('Settings saved successfully!')
        setPassword('')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      alert('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-800">Shiprocket Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Shiprocket email"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleVerify}
              disabled={verifying}
              variant="outline"
            >
              {verifying ? 'Verifying...' : 'Verify Existing Credentials'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || !email || !password}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}