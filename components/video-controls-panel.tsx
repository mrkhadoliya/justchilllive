"use client"

import { Button } from "@/components/ui/button"
import { Volume2, Volume1, Volume, Monitor, RotateCw } from "lucide-react"
import { useState } from "react"

interface VideoControlsPanelProps {
  onVolumeChange: (volume: number) => void
  onScreenShare?: () => void
  onRotateCamera?: () => void
}

export default function VideoControlsPanel({ onVolumeChange, onScreenShare, onRotateCamera }: VideoControlsPanelProps) {
  const [volume, setVolume] = useState(100)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    onVolumeChange(newVolume / 100)
  }

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    onScreenShare?.()
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Volume Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Volume</label>
        <div className="flex items-center gap-3">
          {volume === 0 ? (
            <Volume className="w-4 h-4 text-muted-foreground" />
          ) : volume < 50 ? (
            <Volume1 className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          )}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground w-8">{volume}</span>
        </div>
      </div>

      {/* Screen Share Button */}
      <Button
        onClick={handleScreenShare}
        variant={isScreenSharing ? "default" : "outline"}
        className="w-full flex items-center gap-2"
      >
        <Monitor className="w-4 h-4" />
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      </Button>

      {/* Rotate Camera Button */}
      <Button onClick={onRotateCamera} variant="outline" className="w-full flex items-center gap-2 bg-transparent">
        <RotateCw className="w-4 h-4" />
        Flip Camera
      </Button>
    </div>
  )
}
