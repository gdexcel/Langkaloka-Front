"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import ProductCard from "@/components/products/ProductCard";
import StoreCard from "@/components/store/StoreCard";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tag, Zap, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Banner Slider ────────────────────────────────────────────
const banners = [
  {
    id: 1,
    tag: "Penawaran Spesial",
    title: "Barang Preloved\nBerkualitas Tinggi",
    subtitle: "Ribuan barang branded second, harga terbaik.",
    cta: "Jelajahi Sekarang",
    bg: "from-blue-600 via-blue-500 to-indigo-600",
    emoji: "🛍️",
    pattern: "circles",
  },
  {
    id: 2,
    tag: "Gratis Listing",
    title: "Mulai Jualan\nHari Ini!",
    subtitle: "Toko gratis, listing unlimited. Ribuan pembeli menunggu.",
    cta: "Buka Toko Sekarang",
    bg: "from-emerald-500 via-teal-500 to-cyan-600",
    emoji: "🚀",
    pattern: "dots",
  },
];

function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const router = useRouter();

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 180);
  };
  const next = () => goTo((current + 1) % banners.length);
  const prev = () => goTo((current - 1 + banners.length) % banners.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const b = banners[current];

  const handleCta = () => {
    if (b.cta === "Jelajahi Sekarang") {
      document
        .getElementById("rekomendasi")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/store-panel/settings");
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-sm select-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
      }}
    >
      <div
        className={`bg-gradient-to-r ${b.bg} transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {b.pattern === "circles" ? (
            <>
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
              <div className="absolute right-10 -bottom-16 h-64 w-64 rounded-full bg-white/5" />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          )}
        </div>
        <div className="relative flex items-center justify-between px-5 py-7 md:px-10 md:py-12 gap-4">
          <div className="flex-1 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold mb-3 backdrop-blur-sm">
              <Tag className="h-2.5 w-2.5" />
              {b.tag}
            </span>
            <h2 className="text-xl md:text-3xl font-bold leading-tight mb-2 whitespace-pre-line">
              {b.title}
            </h2>
            <p className="text-white/75 text-xs md:text-sm max-w-xs mb-4 leading-relaxed">
              {b.subtitle}
            </p>
            <button
              onClick={handleCta}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs md:text-sm font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition shadow-md"
            >
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              {b.cta}
            </button>
          </div>
          <div className="shrink-0 h-20 w-20 md:h-28 md:w-28 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-5xl md:text-6xl">
            {b.emoji}
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Gender Buttons ──────────────────────────────────────────
function GenderButtons() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => router.push("/product/all/women")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        <div className="absolute -right-3 -bottom-3 text-6xl md:text-7xl opacity-20 select-none pointer-events-none">
          👗
        </div>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Kategori
        </p>
        <h3 className="text-base md:text-xl font-bold">Wanita</h3>
        <p className="text-[11px] md:text-sm opacity-70 mt-0.5 hidden sm:block">
          Koleksi fashion wanita
        </p>
        <span className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
          Lihat <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </span>
      </button>
      <button
        onClick={() => router.push("/product/all/men")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        <div className="absolute -right-3 -bottom-3 text-6xl md:text-7xl opacity-20 select-none pointer-events-none">
          👔
        </div>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Kategori
        </p>
        <h3 className="text-base md:text-xl font-bold">Pria</h3>
        <p className="text-[11px] md:text-sm opacity-70 mt-0.5 hidden sm:block">
          Koleksi fashion pria
        </p>
        <span className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
          Lihat <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </span>
      </button>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-100 aspect-square" />
      <div className="p-2 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonStoreCard() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse p-3 w-full">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="h-2.5 bg-gray-200 rounded w-12" />
      <div className="h-2.5 bg-gray-200 rounded w-8" />
    </div>
  );
}

// ─── Store Slider ─────────────────────────────────────────────
function StoreSlider({
  stores,
  isLoading,
}: {
  stores: any[];
  isLoading: boolean;
}) {
  const router = useRouter();
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [cols, setCols] = useState(5);

  // Detect kolom berdasarkan lebar layar
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 640 ? 3 : w < 1024 ? 5 : 8);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Reset ke halaman pertama kalau cols berubah
  useEffect(() => setPage(0), [cols]);

  const totalPages = Math.ceil(stores.length / cols);
  const visibleStores = stores.slice(page * cols, page * cols + cols);

  const gridColsClass =
    cols === 3
      ? "grid-cols-3"
      : cols === 5
        ? "grid-cols-5"
        : cols === 8
          ? "grid-cols-8"
          : "grid-cols-7";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          🏪 Rekomendasi Toko
        </h2>

        {/* Prev/Next — desktop only */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <>
          {/* Skeleton desktop */}
          <div className={`hidden sm:grid ${gridColsClass} gap-2`}>
            {Array.from({ length: cols }).map((_, i) => (
              <SkeletonStoreCard key={i} />
            ))}
          </div>
          {/* Skeleton mobile */}
          <div className="flex sm:hidden gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[calc(33.33%-8px)]">
                <SkeletonStoreCard />
              </div>
            ))}
          </div>
        </>
      ) : stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 w-full gap-2">
          <div className="text-4xl">🏪</div>
          <p className="text-xs text-gray-400">Belum ada toko terdaftar</p>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet: paginasi grid */}
          <div
            className={`hidden sm:grid ${gridColsClass} grid-rows-1 overflow-hidden gap-2`}
          >
            {visibleStores.map((store: any) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => router.push(`/store/${store.id}`)}
              />
            ))}
          </div>

          {/* Mobile: scroll horizontal bebas, 3 card sekaligus */}
          <div
            ref={mobileTrackRef}
            className="flex sm:hidden gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stores.map((store: any) => (
              <div
                key={store.id}
                className="flex-shrink-0 w-[calc(33.33%-8px)]"
              >
                <StoreCard
                  store={store}
                  onClick={() => router.push(`/store/${store.id}`)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ─── Product Section ──────────────────────────────────────────
function ProductSection({
  id,
  title,
  viewAllHref,
  products,
  isLoading,
}: {
  id?: string;
  title: string;
  viewAllHref: string;
  products: any[];
  isLoading: boolean;
}) {
  const router = useRouter();
  return (
    <section
      id={id}
      className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          {title}
        </h2>
        <button
          onClick={() => router.push(viewAllHref)}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 active:opacity-70 md:hover:text-blue-700 cursor-pointer"
        >
          Lihat Semua <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <span className="text-3xl mb-2">📭</span>
          <p className="text-xs text-gray-400">Belum ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function Home() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: allStores, isLoading: storesLoading } = useStores();

  const rekomendasi = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts].sort(() => Math.random() - 0.5).slice(0, 18);
  }, [allProducts]);

  const rekomendasiToko = useMemo(() => {
    if (!allStores?.length) return [];
    return [...allStores].sort(() => Math.random() - 0.5).slice(0, 15);
  }, [allStores]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-350 mx-auto px-3 md:px-8 py-3 md:py-6 space-y-3 md:space-y-5 pb-6">
        <BannerSlider />
        <GenderButtons />
        <ProductSection
          id="rekomendasi"
          title="✨ Rekomendasi Untukmu"
          viewAllHref="/product/all"
          products={rekomendasi}
          isLoading={productsLoading}
        />
        <StoreSlider stores={rekomendasiToko} isLoading={storesLoading} />
      </div>
    </main>
  );
}
