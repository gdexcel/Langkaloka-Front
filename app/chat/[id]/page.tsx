"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"
import Pusher from "pusher-js"

export default function ChatPage() {

  const params = useParams()
  const chatId = params.id as string

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  // 🔥 FETCH MESSAGE
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${chatId}`)
      setMessages(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [chatId])

  // 🔥 STEP 3: MARK AS READ (saat buka chat)
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) return

    fetch(`/api/chat/${chatId}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }, [chatId])

  // 🔥 PUSHER REALTIME + TYPING + READ
  useEffect(() => {

    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
      }
    )

    const channel = pusher.subscribe(`chat-${chatId}`)

    // 🔥 MESSAGE MASUK
    channel.bind("new-message", (data: any) => {
      setMessages((prev) => [...prev, data])
    })

    // 🔥 STEP 4: LISTEN READ
    channel.bind("read", () => {
      fetchMessages()
    })

    // 🔥 TYPING
    channel.bind("typing", (data: any) => {
      const myId = localStorage.getItem("userId")

      if (data.userId === myId) return

      setIsTyping(true)

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }

      typingTimeout.current = setTimeout(() => {
        setIsTyping(false)
      }, 2000)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }

  }, [chatId])

  // 🔥 AUTO SCROLL
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth"
    })
  }, [messages, isTyping])

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {

    if (!text.trim()) return

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Login dulu")
      return
    }

    try {
      await axios.post(
        `/api/chat/${chatId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setText("")

    } catch (error) {
      console.error(error)
    }
  }

  // 🔥 TYPING TRIGGER
  const handleTyping = async (value: string) => {
    setText(value)

    const token = localStorage.getItem("token")
    if (!token) return

    if (typingTimeout.current) return

    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null
    }, 1000)

    try {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ chatId })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">

      <Header />

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-4">

        <h1 className="text-xl font-bold">
          Chat
        </h1>

        {/* 🔥 MESSAGE LIST */}
        <div
          ref={containerRef}
          className="border rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-2"
        >

          {messages.map((msg) => {
            const myId = localStorage.getItem("userId")
            const isMe = msg.senderId === myId

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    px-4 py-2 rounded-2xl max-w-[70%] text-sm flex items-center gap-1
                    ${isMe 
                      ? "bg-black text-white rounded-br-none" 
                      : "bg-gray-200 text-black rounded-bl-none"
                    }
                  `}
                >
                  {/* 🔥 TEXT */}
                  <span>{msg.text}</span>

                  {/* 🔥 STEP 5: ✔✔ */}
                  {isMe && (
                    <span className="text-xs text-gray-300 ml-1">
                      {msg.readAt ? "✔✔" : "✔"}
                    </span>
                  )}

                </div>
              </div>
            )
          })}

          {/* 🔥 TYPING */}
          {isTyping && (
            <p className="text-sm text-gray-400 italic">
              Sedang mengetik...
            </p>
          )}

        </div>

        {/* 🔥 INPUT */}
        <div className="flex gap-2">

          <input
            className="border p-2 rounded w-full"
            placeholder="Ketik pesan..."
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 rounded"
          >
            Kirim
          </button>

        </div>

      </div>

    </main>
  )
}