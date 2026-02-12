import { type NextRequest, NextResponse } from "next/server"

interface QueueUser {
  id: string
  joinedAt: number
  status: "waiting" | "connected"
  connectedWith?: string
}

interface Connection {
  id: string
  user1: string
  user2: string
  startedAt: number
  status: "active" | "ended"
}

// In-memory store (in production, use Redis)
const waitingQueue: QueueUser[] = []
const activeConnections = new Map<string, Connection>()
const userToConnection = new Map<string, string>()

export async function POST(request: NextRequest) {
  const { action, userId, ...data } = await request.json()

  if (action === "queue-join") {
    const existingUser = waitingQueue.find((u) => u.id === userId)
    if (existingUser) {
      return NextResponse.json({
        success: true,
        status: "already-queued",
        position: waitingQueue.indexOf(existingUser) + 1,
        estimatedWait: (waitingQueue.length * 30) / 2,
      })
    }

    const queueUser: QueueUser = {
      id: userId,
      joinedAt: Date.now(),
      status: "waiting",
    }

    waitingQueue.push(queueUser)

    // Try to match if there are 2+ users waiting
    if (waitingQueue.length >= 2) {
      const user1 = waitingQueue.shift()!
      const user2 = waitingQueue.shift()!

      const connectionId = `conn-${Date.now()}`
      const connection: Connection = {
        id: connectionId,
        user1: user1.id,
        user2: user2.id,
        startedAt: Date.now(),
        status: "active",
      }

      activeConnections.set(connectionId, connection)
      userToConnection.set(user1.id, connectionId)
      userToConnection.set(user2.id, connectionId)

      return NextResponse.json({
        success: true,
        status: "matched",
        connectionId,
        matchedWith: user2.id,
        initiator: user1.id === userId,
      })
    }

    return NextResponse.json({
      success: true,
      status: "queued",
      position: waitingQueue.length,
      estimatedWait: (waitingQueue.length * 30) / 2, // Rough estimate
    })
  }

  if (action === "queue-status") {
    const connectionId = userToConnection.get(userId)

    if (connectionId) {
      const connection = activeConnections.get(connectionId)
      if (connection) {
        const otherUserId = connection.user1 === userId ? connection.user2 : connection.user1
        const duration = Math.floor((Date.now() - connection.startedAt) / 1000)

        return NextResponse.json({
          success: true,
          status: "connected",
          connectedWith: otherUserId,
          connectionId,
          duration,
        })
      }
    }

    const position = waitingQueue.findIndex((u) => u.id === userId)
    if (position !== -1) {
      return NextResponse.json({
        success: true,
        status: "waiting",
        position: position + 1,
        usersAhead: position,
        estimatedWait: ((position + 1) * 30) / 2,
      })
    }

    return NextResponse.json({
      success: true,
      status: "idle",
    })
  }

  if (action === "disconnect") {
    const connectionId = userToConnection.get(userId)

    if (connectionId) {
      const connection = activeConnections.get(connectionId)
      if (connection) {
        connection.status = "ended"
        const otherUserId = connection.user1 === userId ? connection.user2 : connection.user1
        userToConnection.delete(userId)
        userToConnection.delete(otherUserId)

        // Clean up after 30 seconds
        setTimeout(() => {
          activeConnections.delete(connectionId)
        }, 30000)
      }
    }

    const queueIndex = waitingQueue.findIndex((u) => u.id === userId)
    if (queueIndex !== -1) {
      waitingQueue.splice(queueIndex, 1)
    }

    return NextResponse.json({ success: true })
  }

  if (action === "get-stats") {
    const totalQueued = waitingQueue.length
    const totalConnected = activeConnections.size
    const totalUsers = totalQueued + totalConnected * 2

    return NextResponse.json({
      success: true,
      stats: {
        queued: totalQueued,
        connected: totalConnected,
        totalUsers,
        avgWaitTime: totalQueued > 0 ? Math.ceil((totalQueued * 30) / 2) : 0,
      },
    })
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
}
