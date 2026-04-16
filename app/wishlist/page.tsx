'use client';

import { Header } from '@/components/views/Header';
import { useFavorites } from '@/hooks/useFavorites';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type Favorite = {
  favoriteId: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
};

export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: favorites, isLoading, error } = useFavorites();
  const token = localStorage.getItem('token');

  // Auth guard
  if (!token) {
    router.replace('/');
    return null;
  }

  const removeFavorite = (productId: string) => {
    if (!confirm('Hapus dari wishlist?')) return;

    startTransition(async () => {
      try {
        await axios.delete(`/api/favorites/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      } catch (err) {
        console.error('Remove failed', err);
        alert('Gagal menghapus dari wishlist');
      }
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Gagal memuat wishlist
            </h2>
            <p className="text-red-600 mb-6">
              Coba refresh halaman atau login ulang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-700 transition"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
          My Wishlist ({favorites?.length || 0})
        </h1>

        {!favorites || favorites.length === 0 ? (
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-12 text-center">
            <Heart className="h-24 w-24 text-rose-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Wishlist kosong
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Belum ada produk favorit. Temukan barang impianmu dan tambahkan ke
              wishlist!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <Heart className="h-5 w-5" />
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((fav: Favorite) => (
              <Link
                key={fav.favoriteId}
                href={`/product/${fav.productId}`}
                className="block"
              >
                <div className="group relative border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFavorite(fav.productId);
                    }}
                    disabled={isPending}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm border backdrop-blur-sm transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    title="Hapus dari wishlist"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                  {fav.image ? (
                    <Image
                      src={fav.image}
                      className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={fav.name}
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {fav.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {fav.price?.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
