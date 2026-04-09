"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"

export default function ChatListPage() {

  const [chats, setChats] = useState<any[]>([])

  const fetchChats = async () => {
    try {

      const token = localStorage.getItem("token")

      const res = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setChats(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-4">
          Chat
        </h1>

        <div className="flex flex-col gap-3">

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => window.location.href = `/chat/${chat.id}`}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            >
              Chat ID: {chat.id}
            </div>
          ))}

        </div>

      </div>

    </main>
  )
}