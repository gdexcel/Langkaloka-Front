"use client"

import axios from "axios"
import { useState } from "react"
import { useCreateStore } from "@/hooks/useCreateStore"
import { Header } from "@/components/views/Header"
import { useRouter } from "next/navigation"

export default function CreateStorePage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
const [image, setImage] = useState<File | null>(null)

  const { mutate, isPending } = useCreateStore()


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!name) {
    alert("Nama toko wajib diisi")
    return
  }

  try {

    let imageUrl = null

    // 🔥 UPLOAD IMAGE
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

    const token = localStorage.getItem("token")

    // 🔥 CREATE STORE
    await axios.post(
      "/api/stores/create",
      {
        name,
        description,
        location,
        image: imageUrl
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    alert("Store berhasil dibuat 🎉")

    router.push("/sell")

  } catch (error: any) {

    alert(
      error?.response?.data?.error ||
      "Gagal membuat toko"
    )

    console.error(error)
  }
}

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create Your Store
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            className="border p-3 rounded"
            placeholder="Store name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            className="border p-3 rounded"
            placeholder="Store description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
          <input
  className="border p-3 rounded-lg"
  placeholder="Lokasi toko"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
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

          <button
            className="bg-black text-white py-3 rounded disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Store"}
          </button>

        </form>

      </div>

    </main>
  )
}