"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false)
  const { toast } = useToast()

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/seed", { method: "POST" })
      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to seed database",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Button onClick={handleSeed} disabled={isSeeding} className="bg-[#D4915D] hover:bg-[#C17A45] text-white">
      {isSeeding ? "Seeding..." : "Seed Database"}
    </Button>
  )
}
