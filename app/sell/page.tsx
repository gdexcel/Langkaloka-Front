"use client"

import { Header } from "@/components/views/Header"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"

export default function SellPage() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [condition, setCondition] = useState("used")
  const [image, setImage] = useState<File | null>(null)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {

    const token = localStorage.getItem("token")

    let imageUrl = null

    if (image) {

      const reader = new FileReader()

      reader.readAsDataURL(image)

      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
      })

      const uploadRes = await axios.post("/api/upload", {
        image: base64
      })

      imageUrl = uploadRes.data.url

    }

    await axios.post(
      "/api/products/create",
      {
        name,
        description,
        price: Number(price),
        condition,
        image: imageUrl
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


useEffect(() => {

  const checkStore = async () => {

    const token = localStorage.getItem("token")

    if (!token) return

    try {

      const res = await axios.get("/api/stores/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.data) {
        window.location.href = "/store/create"
      }

    } catch {
      window.location.href = "/store/create"
    }

  }

  checkStore()

}, [])

  return (
    <main className="min-h-screen">

      <Header />

    <div className="max-w-xl mx-auto p-6 pb-24">

  <h1 className="text-2xl font-bold mb-6">
    Jual Barang
  </h1>

  <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4 mt-4"
  >

    <input
      className="border p-3 rounded-lg"
      placeholder="Nama barang"
      value={name}
      onChange={(e)=>setName(e.target.value)}
    />

    <input
      className="border p-3 rounded-lg"
      placeholder="Harga"
      value={price}
      onChange={(e)=>setPrice(e.target.value)}
    />

    <textarea
      className="border p-3 rounded-lg"
      placeholder="Deskripsi"
      value={description}
      onChange={(e)=>setDescription(e.target.value)}
    />
    <input
  type="file"
  accept="image/*"
  className="border p-3 rounded-lg"
  onChange={(e) => {
    if (e.target.files) {
      setImage(e.target.files[0])
    }
  }}
/>
    <select
      className="border p-3 rounded-lg"
      value={condition}
      onChange={(e)=>setCondition(e.target.value)}
    >
      <option value="new">New</option>
      <option value="used">Used</option>
    </select>
  
    <button
      type="submit"
    className="
  bg-black
  text-white
  py-3
  rounded-lg
  mt-4
  hover:bg-gray-800
  transition
"
    >
      Publish Product
    </button>

  </form>

</div>


    </main>
  )
}