"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Activity } from "lucide-react"

interface ConnectionStats {
  rtt: number // Round trip time in ms
  bandwidth: number // Estimated bandwidth in kbps
  packetLoss: number // Percentage
  videoResolution: string
}

interface ConnectionMonitorProps {
  peerId: string
  connectionStatus: string
}

export default function ConnectionMonitor({ peerId, connectionStatus }: ConnectionMonitorProps) {
  const [stats, setStats] = useState<ConnectionStats | null>(null)

  useEffect(() => {
    const updateStats = async () => {
      // In a real implementation, this would use RTCPeerConnection.getStats()
      setStats({
        rtt: Math.floor(Math.random() * 50) + 10,
        bandwidth: Math.floor(Math.random() * 3000) + 500,
        packetLoss: Math.floor(Math.random() * 5),
        videoResolution: "1280x720",
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 2000)

    return () => clearInterval(interval)
  }, [peerId])

  const getQualityIndicator = () => {
    if (!stats) return "unknown"
    if (stats.rtt > 100 || stats.packetLoss > 5) return "poor"
    if (stats.rtt > 50 || stats.packetLoss > 2) return "fair"
    return "good"
  }

  const quality = getQualityIndicator()
  const qualityColors = {
    good: "text-green-500",
    fair: "text-yellow-500",
    poor: "text-red-500",
    unknown: "text-gray-500",
  }

  if (connectionStatus !== "connected" || !stats) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg p-4 max-w-xs text-sm">
      <div className="flex items-center gap-2 mb-3">
        <Activity className={`w-4 h-4 ${qualityColors[quality as keyof typeof qualityColors]}`} />
        <span className="font-semibold capitalize">Connection: {quality}</span>
      </div>

      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>Latency:</span>
          <span className="font-mono">{stats.rtt}ms</span>
        </div>
        <div className="flex justify-between">
          <span>Bandwidth:</span>
          <span className="font-mono">{stats.bandwidth}kbps</span>
        </div>
        <div className="flex justify-between">
          <span>Packet Loss:</span>
          <span className="font-mono">{stats.packetLoss}%</span>
        </div>
        <div className="flex justify-between">
          <span>Resolution:</span>
          <span className="font-mono">{stats.videoResolution}</span>
        </div>
      </div>

      {quality === "poor" && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 rounded text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Poor connection quality. Try moving closer to your router.</span>
        </div>
      )}
    </div>
  )
}
