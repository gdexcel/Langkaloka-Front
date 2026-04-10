"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Header } from "@/components/views/Header"

export default function StorePanelPage() {

  const [products, setProducts] = useState<any[]>([])

  const fetchProducts = async () => {
    try {

      const token = localStorage.getItem("token")

      const res = await axios.get("/api/seller/products", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(res.data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const markAsSold = async (id: string) => {
    try {

      const token = localStorage.getItem("token")

      await axios.patch(`/api/products/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert("Ditandai SOLD")

      fetchProducts()

    } catch (error) {
      console.error(error)
    }
  }
  const deleteProduct = async (id: string) => {
  const confirmDelete = confirm("Yakin mau hapus produk ini?")

  if (!confirmDelete) return

  try {

    const token = localStorage.getItem("token")

    await axios.delete(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    alert("Produk berhasil dihapus")

    fetchProducts()

  } catch (error) {
    console.error(error)
  }
}

  return (
    <main className="min-h-screen">

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">
          Seller Panel
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3">

              {product.image ? (
                <img
                  src={product.image}
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  No Image
                </div>
              )}

              <p className="mt-2 font-semibold">
                {product.name}
              </p>

              <p className="text-sm">
                Rp {product.price}
              </p>

           {product.isSold ? (
  <p className="text-red-500 mt-2 font-bold">
    SOLD
  </p>
) : (
  <button
    onClick={() => markAsSold(product.id)}
    className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
  >
    Tandai Sold
  </button>
)}

{/* 🔥 DELETE BUTTON */}
<button
  onClick={() => deleteProduct(product.id)}
  className="mt-2 bg-gray-800 text-white px-3 py-1 rounded"
>
  Delete
</button>

            </div>
          ))}

        </div>

      </div>

    </main>
  )
}