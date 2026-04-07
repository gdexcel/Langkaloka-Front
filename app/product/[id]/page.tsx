"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useParams } from "next/navigation"
import { useProduct } from "@/hooks/useProduct"
import { Header } from "@/components/views/Header"
import Link from "next/link"
import axios from "axios"

export default function ProductDetailPage() {

  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading } = useProduct(id)
  const { data: user } = useCurrentUser()
  const isOwner = user && product ? user.id === product.storeOwnerId : false

  if (isLoading) return <p>Loading...</p>

  if (!product) return <p>Product not found</p>

const markAsSold = async () => {

  const token = localStorage.getItem("token")

  if (!token) {
    alert("Login dulu")
    return
  }

  try {

    await axios.patch(`/api/products/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    alert("Produk berhasil ditandai SOLD")

    window.location.reload()

  } catch (error) {
    console.error(error)
  }
  

}


  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-6xl mx-auto p-6">

     <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="w-full max-w-md">

   {product.image ? (

<div className="relative">

  <img
    src={product.image}
    className="w-full max-w-lg h-[420px] object-cover rounded-xl border"
  />

  {product.isSold && (
    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded">
      SOLD
    </div>
  )}

</div>

) : (

  <div className="
    bg-gray-100
    w-full
    max-w-lg
    h-[420px]
    flex
    items-center
    justify-center
    rounded-xl
  ">
    No Image
  </div>

)}
</div>


        <div className="flex flex-col gap-3">

  <h1 className="text-3xl font-bold">
    {product.name}
  </h1>

  <Link href={`/store/${product.storeId}`}>
    <p className="text-sm text-blue-500 cursor-pointer hover:underline">
      Kunjungi Toko
    </p>
  </Link>

  <p className="text-xl font-semibold">
    Rp {product.price}
  </p>

  <p className="text-gray-600">
    {product.description}
  </p>

 <button
  style={{ backgroundColor: "black", color: "white" }}
  className="mt-6 px-6 py-3 rounded-lg shadow-md"
>
  Chat Seller
</button>

{isOwner && !product.isSold && (
  <button
    onClick={markAsSold}
    style={{ backgroundColor: "#dc2626", color: "white" }}
    className="mt-3 px-6 py-3 rounded-lg shadow-md"
  >
    Tandai Terjual
  </button>
)}

</div>

        </div>

      </div>

    </main>
  )
}