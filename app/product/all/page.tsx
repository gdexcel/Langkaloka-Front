//langkaloka-v1\app\product\all\page.tsx
"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 aspect-square" />
      <div className="p-2 space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function AllProductsPage() {
  const router = useRouter();
  const { data: allProducts, isLoading } = useProducts();
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const loaderRef = useRef<HTMLDivElement>(null);

  // Randomize sekali saat data pertama kali masuk
  const shuffled = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts].sort(() => Math.random() - 0.5);
  }, [allProducts]);

  const totalPages = Math.ceil(shuffled.length / PAGE_SIZE);
  const hasMore = page < totalPages;

  // Produk yang ditampilkan (akumulatif)
  const displayed = useMemo(
    () => shuffled.slice(0, page * PAGE_SIZE),
    [shuffled, page],
  );

  // Load favorites
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    axios
      .get("/api/favorites", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) =>
        setFavoriteIds(
          new Set((res.data || []).map((f: any) => String(f.productId))),
        ),
      )
      .catch(() => {});
  }, []);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        setPage((p) => p + 1);
      }
    },
    [hasMore, isLoading],
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-6 pb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-bold text-gray-900">
                🛍️ Semua Produk
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isLoading
                  ? "Memuat..."
                  : `${shuffled.length} barang · menampilkan ${displayed.length}`}
              </p>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : shuffled.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-3">🛍️</div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Belum ada produk
              </h3>
              <p className="text-xs text-gray-400">
                Jadi yang pertama jualan di LangkaLoka!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                {displayed.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    initialIsFavorite={favoriteIds.has(String(product.id))}
                  />
                ))}

                {/* Skeleton tambahan saat load lebih */}
                {hasMore &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={`skel-${i}`} />
                  ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loaderRef} className="h-4 mt-4" />

              {!hasMore && displayed.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-6 pb-2">
                  ✅ Semua produk sudah ditampilkan
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
