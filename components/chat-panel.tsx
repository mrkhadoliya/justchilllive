"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Smile, MessageCircle } from "lucide-react"

interface Message {
  id: string
  text: string
  isLocal: boolean
  timestamp: Date
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void
}

const EMOJI_REACTIONS = ["😂", "😍", "🔥", "👍", "🎉", "😮"]

export default function ChatPanel({ onSendMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        isLocal: true,
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      onSendMessage(inputValue)
      setInputValue("")
      setShowEmojiPicker(false)

      // Simulate receiving a message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Nice talking to you!",
            isLocal: false,
            timestamp: new Date(),
          },
        ])
      }, 800)
    }
  }

  const handleEmojiClick = (emoji: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: emoji,
      isLocal: true,
      timestamp: new Date(),
    }
    setMessages([...messages, newMessage])
    onSendMessage(emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden flex-1">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-2">
              <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm text-muted-foreground">Start chatting...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isLocal ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm break-words ${
                    msg.isLocal ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="border-t border-border p-3 bg-background/50 grid grid-cols-6 gap-2">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:scale-125 transition-transform"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 bg-background/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} size="sm" variant="outline" className="px-2">
            <Smile className="w-4 h-4" />
          </Button>
          <Button onClick={handleSendMessage} size="sm" className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
