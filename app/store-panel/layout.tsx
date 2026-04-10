"use client"

import { Header } from "@/components/views/Header"

export default function StorePanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">

      <Header />

      <div className="flex">

        {/* 🔥 SIDEBAR */}
        <div className="w-64 min-h-screen border-r p-4 flex flex-col gap-3">

          <button
            onClick={() => window.location.href = "/store-panel"}
            className="text-left hover:bg-gray-100 p-2 rounded"
          >
            Dashboard
          </button>

        <button
  onClick={() => window.location.href = "/store-panel/products"}
  className="text-left hover:bg-gray-100 p-2 rounded"
>
  Produk Saya
</button>

          <button
            onClick={() => window.location.href = "/sell"}
            className="text-left hover:bg-gray-100 p-2 rounded"
          >
            Tambah Produk
          </button>

        </div>

        {/* 🔥 CONTENT */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </div>

    </main>
  )
}