"use client"

import { useState, useRef, useCallback } from "react"

interface RTCConfig {
  iceServers: RTCIceServer[]
}

const rtcConfig: RTCConfig = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }, { urls: ["stun:stun1.l.google.com:19302"] }],
}

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const initializeConnection = useCallback(async () => {
    try {
      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })

      localStreamRef.current = stream
      setLocalStream(stream)

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: rtcConfig.iceServers,
      })

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to remote peer
          console.log("ICE candidate:", event.candidate)
        }
      }

      peerConnectionRef.current = peerConnection

      // Create data channel for messages
      const dataChannel = peerConnection.createDataChannel("chat", {
        ordered: true,
      })
      setupDataChannel(dataChannel)

      // Listen for incoming data channels
      peerConnection.ondatachannel = (event) => {
        setupDataChannel(event.channel)
      }
    } catch (error) {
      console.error("Error initializing WebRTC:", error)
    }
  }, [])

  const setupDataChannel = (dataChannel: RTCDataChannel) => {
    dataChannelRef.current = dataChannel

    dataChannel.onopen = () => {
      console.log("Data channel opened")
    }

    dataChannel.onmessage = (event) => {
      console.log("Received message:", event.data)
    }

    dataChannel.onclose = () => {
      console.log("Data channel closed")
    }

    dataChannel.onerror = (error) => {
      console.error("Data channel error:", error)
    }
  }

  const endConnection = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    setLocalStream(null)
    setRemoteStream(null)
  }, [])

  const toggleAudio = useCallback((enabled: boolean) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }, [])

  const toggleVideo = useCallback((enabled: boolean) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }, [])

  const sendMessage = useCallback((message: string) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === "open") {
      dataChannelRef.current.send(message)
    }
  }, [])

  return {
    localStream,
    remoteStream,
    initializeConnection,
    endConnection,
    toggleAudio,
    toggleVideo,
    sendMessage,
  }
}
