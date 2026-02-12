"use client"

import { useEffect, useState } from "react"
import { Users, Clock, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface QueueStats {
  queued: number
  connected: number
  totalUsers: number
  avgWaitTime: number
}

export default function QueueStatus() {
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/queue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get-stats" }),
        })
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching queue stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Wait</p>
            <p className="text-xl font-bold">{stats.avgWaitTime}s</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">In Queue</p>
            <p className="text-xl font-bold">{stats.queued}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
