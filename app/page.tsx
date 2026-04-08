"use client"

import { useState } from "react"
import { Header } from "@/components/views/Header"
import { useProducts } from "@/hooks/useProducts"
import ProductCard from "@/components/products/ProductCard"

export default function Home() {

  const { data: products, isLoading } = useProducts()

  // 🔥 STATE SEARCH
  const [search, setSearch] = useState("")

  // 🔥 FILTER DI FRONTEND (AMAN)
  const filteredProducts = products?.filter((product: any) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="flex flex-col min-h-screen">

      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6">

        <h1 className="text-2xl font-bold mb-6">
          Marketplace
        </h1>

        {/* 🔥 SEARCH INPUT */}
        <input
          className="border p-3 rounded-lg w-full mb-6"
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading && <p>Loading products...</p>}

        {/* 🔥 GRID */}
        <div className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-5
        ">

          {filteredProducts?.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </div>

    </main>
  )
}