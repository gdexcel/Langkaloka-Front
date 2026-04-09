"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"

export default function ChatPage() {

  const params = useParams()
  const chatId = params.id as string

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 🔥 ambil message
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${chatId}`)
      setMessages(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  // 🔥 pertama kali load
  useEffect(() => {
    fetchMessages()
  }, [chatId])

  // 🔥 auto refresh tiap 2 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages()
    }, 2000)

    return () => clearInterval(interval)
  }, [chatId])

  // 🔥 auto scroll (AMAN, gak ganggu user)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 50

    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // 🔥 kirim message
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
      fetchMessages()

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
                    px-4 py-2 rounded-2xl max-w-[70%] text-sm
                    ${isMe 
                      ? "bg-black text-white rounded-br-none" 
                      : "bg-gray-200 text-black rounded-bl-none"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            )
          })}

          {/* 🔥 anchor scroll */}
          <div ref={bottomRef} />

        </div>

        {/* 🔥 INPUT */}
        <div className="flex gap-2">

          <input
            className="border p-2 rounded w-full"
            placeholder="Ketik pesan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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