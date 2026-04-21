// langkaloka-v1\app\store-panel\products\page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Pencil,
  PlusCircle,
  Trash2,
  Package,
} from "lucide-react";

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
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/seller/products", {
        headers: { Authorization: `Bearer ${token}` },
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

  const markAsSoldOrUnsold = async (id: string, value: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/products/${id}`,
        { isSold: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Manajemen Produk
          </p>
          <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
            Semua Produk Milik Kamu
          </h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Kelola semua produk toko dengan mudah.
          </p>
        </div>

        <button
          onClick={() => router.push("/store-panel/sell")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 sm:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Produk Baru
        </button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="h-36 animate-pulse bg-gray-100 sm:h-44" />
              <div className="space-y-2 p-3">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-8 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Package className="h-7 w-7 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Belum ada produk</p>
            <p className="mt-1 text-sm text-gray-400">
              Mulai tambahkan produk pertama untuk toko kamu.
            </p>
          </div>
          <button
            onClick={() => router.push("/store-panel/sell")}
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative shrink-0">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="h-36 w-full object-cover sm:h-44"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center bg-gray-100 text-xs text-gray-400 sm:h-44">
                    Tidak ada gambar
                  </div>
                )}

                {product.isSold && (
                  <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Sold
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3 gap-1">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-gray-700">
                  Rp {Number(product.price || 0).toLocaleString("id-ID")}
                </p>

                {/* Actions */}
                <div className="mt-auto pt-3 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        router.push(`/store-panel/products/${product.id}/edit`)
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-95"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    {!product.isSold ? (
                      <button
                        onClick={() => markAsSoldOrUnsold(product.id, true)}
                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Sold
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsSoldOrUnsold(product.id, false)}
                        className="rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 active:scale-95"
                      >
                        Batalkan
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-100 active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
