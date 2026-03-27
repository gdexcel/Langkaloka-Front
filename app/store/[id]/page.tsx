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
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            {data.store.name}
          </h1>

          <p className="text-gray-500 mt-2">
            {data.store.description}
          </p>

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