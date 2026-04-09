"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"

export default function ChatPage() {

  const params = useParams()
  const chatId = params.id as string

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  // 🔥 ambil message
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
  }, [])

  // 🔥 kirim message
  const sendMessage = async () => {

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
        <div className="border rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-2">
{messages.map((msg) => {

  const myId = localStorage.getItem("userId")

  console.log("MY ID:", myId)
  console.log("SENDER ID:", msg.senderId)

  const isMe = msg.senderId === myId

  return (
    <div
      key={msg.id}
      className={isMe ? "flex justify-end" : "flex justify-start"}
    >
      <div
        className={
          isMe
            ? "bg-black text-white px-4 py-2 rounded-lg max-w-[70%]"
            : "bg-gray-200 text-black px-4 py-2 rounded-lg max-w-[70%]"
        }
      >
        {msg.text}
      </div>
    </div>
  )
})}

        </div>

        {/* 🔥 INPUT */}
        <div className="flex gap-2">

          <input
            className="border p-2 rounded w-full"
            placeholder="Ketik pesan..."
            value={text}
            onChange={(e) => setText(e.target.value)}
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