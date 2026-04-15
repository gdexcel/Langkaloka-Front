'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Pencil, PlusCircle, Trash2 } from 'lucide-react';

type SellerProduct = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  isSold: boolean;
};

export default function SellerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.get('/api/seller/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const markAsSoldorUnsold = async (id: string, value: boolean) => {
    try {
      const token = localStorage.getItem('token');

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

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Yakin mau hapus produk ini?')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Manajemen Produk
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Produk Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola semua produk toko dengan tampilan yang simpel.
          </p>
        </div>

        <button
          onClick={() => router.push('/store-panel/sell')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Produk
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="h-44 animate-pulse bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-9 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-10 text-center">
          <p className="text-lg font-semibold text-gray-900">
            Belum ada produk
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Mulai tambahkan produk pertama untuk toko kamu.
          </p>
          <button
            onClick={() => router.push('/store-panel/sell')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="h-44 w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-500">
                    Tidak ada gambar
                  </div>
                )}

                {product.isSold && (
                  <div className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Sold
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                  {product.name}
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  Rp {Number(product.price || 0).toLocaleString()}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      router.push(`/store-panel/products/${product.id}/edit`)
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  {!product.isSold ? (
                    <button
                      onClick={() => markAsSoldorUnsold(product.id, true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Tandai Sold
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsSoldorUnsold(product.id, false)}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Batalkan Sold
                    </button>
                  )}
                </div>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
