import { type NextRequest, NextResponse } from "next/server"

const connectedUsers = new Map<
  string,
  {
    id: string
    socketId: string
    gender?: "male" | "female" | "any"
    connectedWith?: string
  }
>()

const waitingQueue: Array<{ id: string; gender?: "male" | "female" | "any" }> = []

function generateId() {
  return Math.random().toString(36).substring(7)
}

function matchUsers(): { user1: string; user2: string } | null {
  if (waitingQueue.length < 2) return null

  for (let i = 0; i < waitingQueue.length; i++) {
    for (let j = i + 1; j < waitingQueue.length; j++) {
      const user1 = waitingQueue[i]
      const user2 = waitingQueue[j]

      // Check gender compatibility
      const user1WantsGender = user1.gender && user1.gender !== "any"
      const user2WantsGender = user2.gender && user2.gender !== "any"

      const compatible =
        !user1WantsGender ||
        !user2WantsGender ||
        (user1WantsGender && user1.gender === user2.gender) ||
        (user2WantsGender && user2.gender === user1.gender) ||
        user1.gender === "any" ||
        user2.gender === "any"

      if (compatible) {
        waitingQueue.splice(j, 1)
        waitingQueue.splice(i, 1)
        return { user1: user1.id, user2: user2.id }
      }
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  const { action, userId, data, gender } = await request.json()

  if (action === "join") {
    const id = generateId()
    connectedUsers.set(id, { id, socketId: userId, gender: gender || "any" })
    waitingQueue.push({ id, gender: gender || "any" })

    // Try to match with another user
    const match = matchUsers()
    if (match) {
      connectedUsers.set(match.user1, { ...connectedUsers.get(match.user1)!, connectedWith: match.user2 })
      connectedUsers.set(match.user2, { ...connectedUsers.get(match.user2)!, connectedWith: match.user1 })

      return NextResponse.json({
        success: true,
        matched: true,
        peerId: id,
        connectedWith: match.user2 === id ? match.user1 : match.user2,
        users: [match.user1, match.user2],
      })
    }

    return NextResponse.json({
      success: true,
      matched: false,
      peerId: id,
      message: "Waiting for another user...",
    })
  }

  if (action === "disconnect") {
    const user = connectedUsers.get(userId)
    if (user?.connectedWith) {
      const connectedUser = connectedUsers.get(user.connectedWith)
      if (connectedUser) {
        connectedUsers.delete(user.connectedWith)
      }
    }
    connectedUsers.delete(userId)
    const index = waitingQueue.findIndex((u) => u.id === userId)
    if (index > -1) {
      waitingQueue.splice(index, 1)
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
}
