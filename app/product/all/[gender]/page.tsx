//langkaloka-v1\app\product\all\[gender]\page.tsx
"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const PAGE_SIZE = 20;

const GENDER_CONFIG: Record<
  string,
  { label: string; emoji: string; categoryName: string }
> = {
  women: { label: "Produk Wanita", emoji: "👗", categoryName: "women" },
  men: { label: "Produk Pria", emoji: "👔", categoryName: "men" },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-100 aspect-square" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="px-1 text-gray-400 text-sm">...</span>
            )}
            <button
              onClick={() => onChange(p)}
              className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition cursor-pointer ${p === page ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function GenderProductPage() {
  const router = useRouter();
  const { gender } = useParams<{ gender: string }>();
  const config = GENDER_CONFIG[gender] ?? {
    label: "Produk",
    emoji: "🛍️",
    categoryName: gender,
  };

  const { data: allProducts, isLoading } = useProducts();
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      try {
        const res = await axios.get("/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteIds(
          new Set((res.data || []).map((fav: any) => String(fav.productId))),
        );
      } catch {
        setFavoriteIds(new Set());
      }
    };
    loadFavorites();
  }, []);

  const favoriteMap = useMemo(() => favoriteIds, [favoriteIds]);

  const filtered = useMemo(
    () =>
      (allProducts || []).filter((p: any) => {
        const cat =
          typeof p.category === "string" ? p.category : p.category?.name || "";
        return cat.toLowerCase() === config.categoryName;
      }),
    [allProducts, config.categoryName],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {config.emoji} {config.label}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isLoading
                    ? "Memuat..."
                    : `${filtered.length} barang tersedia${totalPages > 1 ? ` · Hal ${page} dari ${totalPages}` : ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">{config.emoji}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Belum ada produk {config.label.toLowerCase()}
              </h3>
              <p className="text-sm text-gray-400">Cek lagi nanti ya!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {paginated.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    initialIsFavorite={favoriteMap.has(String(product.id))}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
