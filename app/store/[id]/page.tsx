"use client"

import { useParams } from "next/navigation"
import { useStore } from "@/hooks/useStore"
import { Header } from "@/components/views/Header"
import ProductCard from "@/components/products/ProductCard"

export default function StorePage() {

  const params = useParams()
  const id = params.id as string

  const { data, isLoading } = useStore(id)

  if (isLoading) return <p>Loading...</p>

  if (!data) return <p>Store not found</p>

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-6xl mx-auto p-6">

     {/* STORE INFO */}
<div className="flex items-center gap-4 mb-8">

  {/* 🔥 FOTO TOKO */}
  {data.store.image ? (
    <img
      src={data.store.image}
      className="w-20 h-20 rounded-full object-cover border shadow"
    />
  ) : (
    <div className="w-20 h-20 bg-gray-200 rounded-full" />
  )}

  {/* 🔥 INFO TOKO */}
  <div>

    <h1 className="text-3xl font-bold">
      {data.store.name}
    </h1>

    <p className="text-gray-500">
      {data.store.description}
    </p>

    <p className="text-sm text-gray-400 mt-1">
      📍 {data.store.location || "Lokasi belum diisi"}
    </p>

  </div>

</div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {data.products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}

        </div>

      </div>

    </main>
  )
}