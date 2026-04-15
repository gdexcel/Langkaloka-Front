'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { Header } from '@/components/views/Header';
import Link from 'next/link';
import axios from 'axios';
import { MapPin, Store, Tag } from 'lucide-react';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading } = useProduct(id);
  const { data: user } = useCurrentUser();
  const isOwner = user && product ? user.id === product.storeOwnerId : false;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-sm text-gray-500">Product not found</p>
        </div>
      </main>
    );
  }

  const markAsSoldorUnsold = async (value: boolean) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Login dulu');
      return;
    }

    try {
      await axios.patch(
        `/api/products/${id}`,
        {
          isSold: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        value
          ? 'Produk berhasil ditandai SOLD'
          : 'Batalkan Tandai Terjual berhasil',
      );

      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const handleChat = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Login dulu');
      return;
    }

    try {
      const res = await axios.post(
        '/api/chat/create',
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const chatId = res.data.id;

      // 🔥 redirect ke halaman chat
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              {product.image ? (
                <img
                  src={product.image}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              {product.isSold && (
                <div className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                  SOLD
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <Tag className="h-3.5 w-3.5" />
                    {product.category}
                  </span>
                )}
                {product.condition && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.condition}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                {product.name}
              </h1>

              <p className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Informasi Toko
              </h2>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span>{product.storeName || 'Nama toko tidak tersedia'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{product.storeLocation || 'Lokasi belum diisi'}</span>
                </p>
              </div>

              <Link
                href={`/store/${product.storeId}`}
                className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Kunjungi Toko
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Deskripsi Produk
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description || 'Belum ada deskripsi produk.'}
              </p>
            </div>

            <div className="sticky bottom-3 z-10 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
              {!isOwner && (
                <button
                  onClick={handleChat}
                  className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Chat Seller
                </button>
              )}

              {isOwner && !product.isSold && (
                <button
                  onClick={() => markAsSoldorUnsold(true)}
                  className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Tandai Terjual
                </button>
              )}

              {isOwner && product.isSold && (
                <button
                  onClick={() => markAsSoldorUnsold(false)}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Batalkan Tandai Terjual
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
