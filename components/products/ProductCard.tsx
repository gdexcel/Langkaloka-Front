'use client';

import Link from 'next/link';
import axios from 'axios';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  condition?: string;
  image?: string;
  category?: string | { name?: string } | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Login dulu');
      return;
    }

    try {
      await axios.post(
        '/api/favorites',
        { productId: product.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Added ❤️');
    } catch (error: any) {
      // kalau sudah ada → kita remove
      if (error?.response?.data?.message === 'Already in favorites') {
        await axios.delete(`/api/favorites/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert('Removed ❌');
      } else {
        console.error(error);
      }
    }
  };
  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="
        relative
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
        {/* FAVORITE BUTTON */}
        <button
          onClick={toggleFavorite}
          className="
    absolute
    top-2
    right-2
    bg-white
    rounded-full
    p-2
    shadow
    hover:scale-110
    transition
  "
        >
          ❤️
        </button>

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
          <h2 className="text-sm font-medium line-clamp-1">{product.name}</h2>

          <p className="text-base font-bold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(product.price)}
          </p>

          {/* Kategori */}
          {typeof product.category === 'string' && product.category && (
            <span className="text-xs text-gray-500">{product.category}</span>
          )}

          {typeof product.category === 'object' && product.category?.name && (
            <span className="text-xs text-gray-500">
              {product.category.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
