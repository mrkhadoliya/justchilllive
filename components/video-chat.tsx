"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Hand,
  Share2,
  Circle,
  MoreVertical,
  MessageCircle,
  Book,
  MessageSquare,
  Sparkles,
  PenTool,
} from "lucide-react"
import { useWebRTCSignaling } from "@/hooks/use-webrtc-signaling"
import ChatPanel from "@/components/chat-panel"

interface VideoChatProps {
  userGender?: "male" | "female" | "any"
}

export default function VideoChat({ userGender }: VideoChatProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    "chat" | "breakroom" | "transcript" | "summarize" | "annotation" | null
  >(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    localStream,
    remoteStream,
    connectionStatus,
    peerId,
    initializeConnection,
    endConnection,
    toggleAudio,
    toggleVideo,
    sendMessage,
  } = useWebRTCSignaling(userGender)

  useEffect(() => {
    initializeConnection().catch((error) => {
      console.log("[v0] Camera init error:", error.message)
      setCameraError(error.message || "Camera access denied")
    })
    return () => {
      endConnection()
    }
  }, [])

  useEffect(() => {
    if (connectionStatus === "connected") {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
      setCallDuration(0)
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
      }
    }
  }, [connectionStatus])

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
      if (audioRef.current && remoteStream.getAudioTracks().length > 0) {
        audioRef.current.srcObject = remoteStream
      }
    }
  }, [remoteStream])

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    toggleAudio(!isAudioEnabled)
  }

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    toggleVideo(!isVideoEnabled)
  }

  const handleEndCall = () => {
    endConnection()
  }

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised)
  }

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        })
        setIsScreenSharing(true)
      } else {
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error("Error sharing screen:", error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col overflow-hidden relative">
      <audio ref={audioRef} autoPlay playsInline />

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-gray-700/50 group">
          {remoteStream && isVideoEnabled ? (
            <>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                  R
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Remote User</p>
                  <p className="text-gray-300 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Connected
                  </p>
                </div>
              </div>
              <button className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 backdrop-blur-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="mb-4">
                <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white text-lg font-bold">
                {connectionStatus === "connecting" ? "Finding someone..." : "Waiting..."}
              </p>
              {cameraError && <p className="text-red-400 text-sm mt-2">{cameraError}</p>}
            </div>
          )}
        </div>

        {activeSidebarTab === "chat" && (
          <div className="w-80 flex flex-col">
            <ChatPanel onSendMessage={sendMessage} />
          </div>
        )}

        <div className="flex-1 relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-gray-700/50 group">
          {localStream && isVideoEnabled ? (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                  Y
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">You</p>
                  <p className="text-gray-300 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Connected
                  </p>
                </div>
              </div>
              <button className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 backdrop-blur-md p-2 rounded-full transition-all opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="mb-4">
                <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <p className="text-white text-lg font-bold">Camera Off</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 pb-6">
        <div className="text-white text-2xl font-mono font-bold">{formatDuration(callDuration)}</div>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handleToggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAudioEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            title="Mute"
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoEnabled ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            title="Stop Video"
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            onClick={() => setActiveSidebarTab(activeSidebarTab === "chat" ? null : "chat")}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeSidebarTab === "chat" ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            title="Chat"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>

          <Button
            onClick={handleRaiseHand}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isHandRaised ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            title="Share Screen"
          >
            <Share2 className="w-5 h-5" />
          </Button>



          <Button
            onClick={handleEndCall}
            className="px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 transition-all ml-4"
            title="Leave Meeting"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" />
            Leave Meeting
          </Button>
        </div>

        <div className="w-32"></div>
      </div>

    </div>
  )
}
