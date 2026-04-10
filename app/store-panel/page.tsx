"use client"

import { useStoreStats } from "@/hooks/useStoreStats"
import { useEffect, useState } from "react"

export default function StorePanelPage() {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data, isLoading } = useStoreStats()

  // 🔥 FIX HYDRATION
  if (!mounted) return null

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL */}
        <div className="border p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total Produk</p>
          <p className="text-3xl font-bold">
            {data?.total ?? 0}
          </p>
        </div>

        {/* SOLD */}
        <div className="border p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Terjual</p>
          <p className="text-3xl font-bold text-red-500">
            {data?.sold ?? 0}
          </p>
        </div>

        {/* ACTIVE */}
        <div className="border p-6 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Masih Dijual</p>
          <p className="text-3xl font-bold text-green-600">
            {data?.active ?? 0}
          </p>
        </div>

      </div>

    </div>
  )
}