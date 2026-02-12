"use client"

import { useState, useRef, useCallback } from "react"

interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate"
  from: string
  to: string
  data: any
}

export function useWebRTCSignaling(userGender?: "male" | "female") {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle")
  const [peerId, setPeerId] = useState<string>("")
  const [remotePeerId, setRemotePeerId] = useState<string>("")

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const iceCandidateBufferRef = useRef<RTCIceCandidate[]>([])
  const remoteDescriptionSetRef = useRef<boolean>(false)

  const rtcConfig = {
    iceServers: [
      { urls: ["stun:stun.l.google.com:19302"] },
      { urls: ["stun:stun1.l.google.com:19302"] },
      { urls: ["stun:stun2.l.google.com:19302"] },
    ],
  }

  const initializeConnection = useCallback(async () => {
    try {
      setConnectionStatus("connecting")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })

      localStreamRef.current = stream
      setLocalStream(stream)

      const joinResponse = await fetch("/api/socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", userId: `user-${Date.now()}`, gender: userGender || "any" }),
      }).then((r) => r.json())

      if (joinResponse.peerId) {
        setPeerId(joinResponse.peerId)

        if (joinResponse.matched && joinResponse.connectedWith) {
          setRemotePeerId(joinResponse.connectedWith)
          setupPeerConnection(stream, joinResponse.peerId, joinResponse.connectedWith)
        }
      }
    } catch (error) {
      console.error("Error initializing connection:", error)
      setConnectionStatus("failed")
    }
  }, [userGender])

  const setupPeerConnection = useCallback(async (stream: MediaStream, myPeerId: string, remotePeerId: string) => {
    try {
      const peerConnection = new RTCPeerConnection(rtcConfig)
      peerConnectionRef.current = peerConnection

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      peerConnection.ontrack = (event) => {
        console.log("Remote track received:", event.track.kind)
        if (event.streams[0]) {
          setRemoteStream(event.streams[0])
        }
      }

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          await fetch("/api/signaling", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "ice-candidate",
              from: myPeerId,
              to: remotePeerId,
              data: { candidate: event.candidate },
            }),
          })
        }
      }

      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === "connected") {
          setConnectionStatus("connected")
        } else if (peerConnection.connectionState === "failed") {
          setConnectionStatus("failed")
        }
      }

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      await fetch("/api/signaling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "offer",
          from: myPeerId,
          to: remotePeerId,
          data: { offer },
        }),
      })

      startPollingMessages(myPeerId, peerConnection)
    } catch (error) {
      console.error("Error setting up peer connection:", error)
      setConnectionStatus("failed")
    }
  }, [])

  const startPollingMessages = useCallback((userId: string, peerConnection: RTCPeerConnection) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/signaling?userId=${userId}`)
        const data = await response.json()

        if (data.messages && data.messages.length > 0) {
          for (const message of data.messages) {
            if (message.type === "offer") {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.offer))
              remoteDescriptionSetRef.current = true

              for (const candidate of iceCandidateBufferRef.current) {
                try {
                  await peerConnection.addIceCandidate(candidate)
                } catch (error) {
                  console.error("Error adding buffered ICE candidate:", error)
                }
              }
              iceCandidateBufferRef.current = []

              const answer = await peerConnection.createAnswer()
              await peerConnection.setLocalDescription(answer)

              await fetch("/api/signaling", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "answer",
                  from: userId,
                  to: message.from,
                  data: { answer },
                }),
              })
            } else if (message.type === "answer") {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(message.data.answer))
              remoteDescriptionSetRef.current = true

              for (const candidate of iceCandidateBufferRef.current) {
                try {
                  await peerConnection.addIceCandidate(candidate)
                } catch (error) {
                  console.error("Error adding buffered ICE candidate:", error)
                }
              }
              iceCandidateBufferRef.current = []
            } else if (message.type === "ice-candidate") {
              if (remoteDescriptionSetRef.current) {
                try {
                  await peerConnection.addIceCandidate(new RTCIceCandidate(message.data.candidate))
                } catch (error) {
                  console.error("Error adding ICE candidate:", error)
                }
              } else {
                iceCandidateBufferRef.current.push(new RTCIceCandidate(message.data.candidate))
              }
            }
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error)
      }
    }, 1000)
  }, [])

  const endConnection = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }

    if (peerId) {
      fetch("/api/socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect", userId: peerId }),
      }).catch(console.error)
    }

    setLocalStream(null)
    setRemoteStream(null)
    setConnectionStatus("idle")
  }, [peerId])

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
      dataChannelRef.current.send(JSON.stringify({ type: "message", text: message }))
    }
  }, [])

  return {
    localStream,
    remoteStream,
    connectionStatus,
    peerId,
    initializeConnection,
    endConnection,
    toggleAudio,
    toggleVideo,
    sendMessage,
  }
}
