"use client"

import { Header } from "@/components/views/Header"
import { useState } from "react"
import axios from "axios"

export default function SellPage() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [condition, setCondition] = useState("used")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {

      const token = localStorage.getItem("token")

      await axios.post(
        "/api/products/create",
        {
          name,
          description,
          price: Number(price),
          condition,
          storeId: null,
          categoryId: null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Product created!")

      window.location.href = "/"

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Jual Barang
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            placeholder="Nama barang"
            className="border p-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Harga"
            className="border p-3 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder="Deskripsi"
            className="border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <button className="bg-black text-white p-3 rounded">
            Publish
          </button>

        </form>

      </div>

    </main>
  )
}