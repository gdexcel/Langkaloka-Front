"use client"

import Link from "next/link"

type Product = {
  id: string
  name: string
  description: string
  price: number
  condition?: string
  image?: string
}

export default function ProductCard({ product }: { product: Product }) {

  return (
    <Link href={`/product/${product.id}`}>

      <div
        className="
        border
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-200
        bg-white
        cursor-pointer
      "
      >

        {/* IMAGE */}
        {product.image ? (

          <img
            src={product.image}
            className="
              aspect-square
              w-full
              object-cover
            "
          />

        ) : (

          <div
            className="
            bg-gray-100
            aspect-square
            flex
            items-center
            justify-center
            text-gray-400
            text-sm
          "
          >
            No Image
          </div>

        )}

        {/* CONTENT */}
        <div className="p-3 flex flex-col gap-1">

          <h2 className="text-sm font-medium line-clamp-1">
            {product.name}
          </h2>

          <p className="text-base font-bold">
            Rp {product.price.toLocaleString()}
          </p>

          {product.condition && (
            <p className="text-xs text-gray-500">
              {product.condition}
            </p>
          )}

        </div>

      </div>

    </Link>
  )
}