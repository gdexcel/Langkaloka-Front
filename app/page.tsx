"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import ProductCard from "@/components/products/ProductCard";
import StoreCard from "@/components/store/StoreCard";
import BannerSlider from "@/components/banner/BannerSlider";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import TutorialStories from "@/components/tutorial/TutorialStories";

// ─── Gender Buttons ───────────────────────────────────────────
function GenderButtons() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Wanita */}
      <button
        onClick={() => router.push("/product/all/women")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        <svg
          className="absolute -right-2 -bottom-2 h-16 w-16 md:h-20 md:w-20 opacity-20 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="32"
            cy="22"
            r="14"
            stroke="white"
            strokeWidth="5"
            fill="none"
          />
          <line
            x1="32"
            y1="36"
            x2="32"
            y2="56"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="22"
            y1="48"
            x2="42"
            y2="48"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Gender
        </p>
        <h3 className="text-base md:text-xl font-bold">Wanita</h3>
        <p className="text-[11px] md:text-sm opacity-70 mt-0.5 hidden sm:block">
          Koleksi fashion wanita
        </p>
        <span className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
          Lihat <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </span>
      </button>

      {/* Pria */}
      <button
        onClick={() => router.push("/product/all/men")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        <svg
          className="absolute right-1 -bottom-2 h-16 w-16 md:h-20 md:w-20 opacity-20 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="26"
            cy="38"
            r="14"
            stroke="white"
            strokeWidth="5"
            fill="none"
          />
          <line
            x1="36"
            y1="28"
            x2="54"
            y2="10"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="42"
            y1="10"
            x2="54"
            y2="10"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="54"
            y1="10"
            x2="54"
            y2="22"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Gender
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

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 3 : 5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => setPage(0), [cols]);

  const totalPages = Math.ceil(stores.length / cols);
  const visibleStores = stores.slice(page * cols, page * cols + cols);
  const gridColsClass = cols === 3 ? "grid-cols-3" : "grid-cols-5";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          🏪 Rekomendasi Toko
        </h2>
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="cursor-pointer h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="cursor-pointer h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className={`hidden sm:grid ${gridColsClass} gap-2`}>
            {Array.from({ length: cols }).map((_, i) => (
              <SkeletonStoreCard key={i} />
            ))}
          </div>
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
          <p className="text-xs text-gray-400">Belum ada toko terdaftar</p>
        </div>
      ) : (
        <>
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
          <div
            ref={mobileTrackRef}
            className="flex sm:hidden gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stores.slice(0, 24).map((store: any) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-xs text-gray-400">Belum ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function Home() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: allStores, isLoading: storesLoading } = useStores();

  const rekomendasiProduct = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [allProducts]);

  const rekomendasiToko = useMemo(() => {
    if (!allStores?.length) return [];
    return [...allStores].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [allStores]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-350 mx-auto px-3 md:px-8 py-3 md:py-6 space-y-3 md:space-y-5 pb-6">
        <BannerSlider />
        <GenderButtons />

        <TutorialStories />

        <ProductSection
          id="rekomendasi"
          title="✨ Rekomendasi Untukmu"
          viewAllHref="/product/all"
          products={rekomendasiProduct}
          isLoading={productsLoading}
        />
        <StoreSlider stores={rekomendasiToko} isLoading={storesLoading} />
      </div>
    </main>
  );
}
