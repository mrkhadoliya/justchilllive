import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory signaling server
interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate"
  from: string
  to: string
  data: any
}

const messages = new Map<string, SignalingMessage[]>()

export async function POST(request: NextRequest) {
  try {
    const { type, from, to, data } = await request.json()

    if (!type || !from || !to) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store the message for the recipient
    if (!messages.has(to)) {
      messages.set(to, [])
    }

    messages.get(to)!.push({
      type: type as "offer" | "answer" | "ice-candidate",
      from,
      to,
      data,
    })

    // Clean old messages (older than 5 minutes)
    const now = Date.now()
    messages.forEach((msgs, key) => {
      messages.set(
        key,
        msgs.filter(() => true),
      ) // Keep all for simplicity
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const userMessages = messages.get(userId) || []
    messages.delete(userId) // Clear messages after retrieval

    return NextResponse.json({
      success: true,
      messages: userMessages,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
