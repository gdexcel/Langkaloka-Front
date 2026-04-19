//langkaloka-v1\components\products\ProductCard.tsx
"use client";

import Link from "next/link";
import axios from "axios";
import { Heart, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  initialIsFavorite = false,
}: {
  product: Product;
  initialIsFavorite?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback("");

    const url = isFavorite ? `/api/favorites/${product.id}` : "/api/favorites";
    const method = isFavorite ? "DELETE" : "POST";

    try {
      await axios({
        method,
        url,
        data: !isFavorite ? { productId: product.id } : undefined,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsFavorite(!isFavorite);
      setFeedback(
        isFavorite ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist",
      );

      // Invalidate to sync wishlist/home
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error: any) {
      console.error("Wishlist error:", error);
      setFeedback("Gagal memperbarui wishlist");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      {product.image ? (
        <div className="overflow-hidden bg-gray-100 rounded-sm">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center bg-gray-100 text-sm text-gray-400">
          No Image
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {categoryName && (
          <span className="w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
            {categoryName}
          </span>
        )}

        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {product.name}
        </h2>

        {product.condition && (
          <p className="text-xs text-gray-500">Kondisi: {product.condition}</p>
        )}

        <p className="mt-auto pt-2 text-base font-bold text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </p>

        <p
          className={`min-h-4 text-[11px] transition ${
            feedback ? "text-emerald-600" : "text-transparent"
          }`}
        >
          {feedback || "."}
        </p>
      </div>
    </Link>
  );
}
