"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"
import { useRouter } from "next/navigation"
import Pusher from "pusher-js"

export default function ChatListPage() {
  const router = useRouter()

  const [chats, setChats] = useState<any[]>([])
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({})

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setChats(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchChats()

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })

    const channel = pusher.subscribe("chat-list")

    // 🔥 UPDATE CHAT LIST
    channel.bind("update", (data: any) => {
      console.log("🔥 UPDATE MASUK", data)
      fetchChats()
    })

    // 🔥 TYPING LISTENER
    channel.bind("typing", (data: any) => {
      const myId = localStorage.getItem("userId")

      if (data.userId === myId) return

      setTypingUsers((prev) => ({
        ...prev,
        [data.chatId]: true
      }))

      setTimeout(() => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.chatId]: false
        }))
      }, 2000)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>

        <div className="flex flex-col">

          {chats.map((chat, index) => (
            <div
              key={`${chat.id}-${index}`}
              onClick={() => router.push(`/chat/${chat.id}`)}
              className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
            >

              <div className="flex justify-between items-center">

                {/* 🔥 NAMA USER */}
                <p className="font-semibold">
                  {chat.otherUserName || "User"}
                </p>

                {/* 🔥 JAM */}
                <p className="text-xs text-gray-400">
                  {chat.updatedAt
                    ? new Date(chat.updatedAt).toLocaleTimeString()
                    : ""}
                </p>

              </div>

              {/* 🔥 LAST MESSAGE / TYPING */}
              <p className="text-sm mt-1 line-clamp-1">

                {typingUsers[chat.id] ? (
                  <span className="text-green-500 italic">
                    sedang mengetik...
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {chat.lastMessage || "Belum ada pesan"}
                  </span>
                )}

              </p>

            </div>
          ))}

        </div>
      </div>
    </main>
  )
}