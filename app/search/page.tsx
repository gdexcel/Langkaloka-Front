"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { Search as SearchIcon, PackageSearch } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // 🔥 SERVER-SIDE SEARCH - passing query ke API
  const { data: products, isLoading } = useProducts(query);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Search Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              Hasil Pencarian
            </h1>
          </div>
          <p className="text-gray-500">
            {query ? (
              <>
                Menampilkan hasil untuk{" "}
                <span className="font-semibold text-blue-600">
                  &quot;{query}&quot;
                </span>
                {!isLoading && (
                  <span className="text-gray-400">
                    {" "}
                    — {products?.length || 0} barang ditemukan
                  </span>
                )}
              </>
            ) : (
              "Ketik sesuatu di search bar untuk mencari barang"
            )}
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 animate-pulse shadow-sm border border-blue-100/50"
              >
                <div className="bg-blue-50 rounded-lg aspect-square mb-3" />
                <div className="h-4 bg-blue-50 rounded mb-2" />
                <div className="h-5 bg-blue-50 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && query && products?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PackageSearch className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tidak ada hasil
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Coba ubah kata kunci pencarian kamu. Tips: gunakan kata yang lebih
              umum atau cek ejaan.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                iPhone
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                Sneakers
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                Tas Branded
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                Laptop
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                Kamera
              </span>
            </div>
          </div>
        )}

        {/* No Query */}
        {!isLoading && !query && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Cari barang preloved
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Gunakan search bar di atas untuk mencari barang preloved yang kamu
              inginkan.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
