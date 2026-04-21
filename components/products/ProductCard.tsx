//langkaloka-v1\components\products\ProductCard.tsx
"use client";

import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  condition?: string;
  image?: string;
  category?: string | { name?: string } | null;
};

export default function ProductCard({
  product,
}: {
  product: Product;
  initialIsFavorite?: boolean;
}) {
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

  const displayCategory = categoryName || "All";

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="h-full flex flex-col rounded-lg sm:rounded-xl bg-white border border-gray-200 overflow-hidden active:scale-[0.97] transition-all duration-150 hover:shadow-sm md:hover:shadow-md md:hover:border-gray-300">
        {/* Image */}
        <div className="overflow-hidden bg-gray-100 aspect-square w-full shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] md:group-hover:scale-[1.05] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1 p-1.5 sm:p-2 md:p-2.5 min-h-[60px] sm:min-h-[72px] md:min-h-[84px] lg:min-h-[90px]">
          <p className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </p>
          <div className="mt-0.5 sm:mt-1">
            <p className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-bold text-gray-900">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(product.price)}
            </p>
            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-blue-500 mt-0.5">
              {displayCategory}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
