"use client"

import { useState } from "react"
import VideoChat from "@/components/video-chat"
import GenderSelector from "@/components/gender-selector"
import { Button } from "@/components/ui/button"
import {Home } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [showInfo, setShowInfo] = useState(false)
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "any" | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5 flex flex-col overflow-hidden relative">
      <div className="absolute top-4 left-4 flex items-center justify-center gap-2 z-10">
          <Link href="/">
          <Button className="w-12 h-12 rounded-full hover:bg-primary/10">
            <Home className="w-12 h-12" />
          </Button>
        </Link> 
      </div>

      <div className="flex-1 overflow-hidden">
        {!selectedGender ? <GenderSelector onSelect={setSelectedGender} /> : <VideoChat userGender={selectedGender} />}
      </div>
    </div>
  )
}
