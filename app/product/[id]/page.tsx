"use client"

import { useParams } from "next/navigation"
import { useProduct } from "@/hooks/useProduct"
import { Header } from "@/components/views/Header"

export default function ProductDetailPage() {

  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading } = useProduct(id)

  if (isLoading) return <p>Loading...</p>

  if (!product) return <p>Product not found</p>

  return (
    <main className="min-h-screen">

      <Header />

      <div className="max-w-6xl mx-auto p-6">

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-gray-100 h-96 flex items-center justify-center">
            No Image
          </div>

          <div>

            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-xl font-semibold mt-3">
              Rp {product.price}
            </p>

            <p className="mt-4 text-gray-600">
              {product.description}
            </p>

            <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg">
              Chat Seller
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}