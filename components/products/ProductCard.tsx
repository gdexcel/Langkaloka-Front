import Link from "next/link"

type Product = {
  id: string
  name: string
  description: string
  price: number
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}>

      <div className="
        bg-white
        border
        rounded-xl
        overflow-hidden
        hover:shadow-lg
        transition
        cursor-pointer
        flex
        flex-col
      ">

        {/* IMAGE */}
        <div className="
          bg-gray-100
          h-48
          flex
          items-center
          justify-center
          text-gray-400
          text-sm
        ">
          No Image
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">

          <h2 className="
            font-semibold
            text-sm
            line-clamp-1
          ">
            {product.name}
          </h2>

          <p className="
            text-xs
            text-gray-500
            line-clamp-2
          ">
            {product.description}
          </p>

          <p className="
            font-bold
            text-base
            mt-1
          ">
            Rp {product.price}
          </p>

        </div>

      </div>

    </Link>
  )
}