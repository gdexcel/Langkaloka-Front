'use client';

import { Header } from '@/components/views/Header';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Tag, Zap } from 'lucide-react';

// ─── Banner Slider ───────────────────────────────────────────
const banners = [
  {
    id: 1,
    tag: 'Penawaran Spesial',
    title: 'Barang Preloved\nBerkualitas Tinggi',
    subtitle:
      'Temukan ribuan barang branded second dengan harga terbaik. Chat langsung, deal cepat!',
    cta: 'Jelajahi Sekarang',
    bg: 'from-blue-600 via-blue-500 to-indigo-600',
    accent: 'bg-blue-400/20',
    emoji: '🛍️',
    pattern: 'circles',
  },
  {
    id: 2,
    tag: 'Gratis Ongkir',
    title: 'Mulai Jualan\nHari Ini, Gratis!',
    subtitle:
      'Toko gratis, listing unlimited. Ribuan pembeli siap menemukan barang kamu.',
    cta: 'Buka Toko Sekarang',
    bg: 'from-emerald-500 via-teal-500 to-cyan-600',
    accent: 'bg-emerald-400/20',
    emoji: '🚀',
    pattern: 'dots',
  },
];

function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 200);
  };

  const prev = () => goTo((current - 1 + banners.length) % banners.length);
  const next = () => goTo((current + 1) % banners.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const b = banners[current];

  const handleCtaClick = () => {
    if (b.cta === 'Jelajahi Sekarang') {
      const productSection = document.getElementById('produk-terbaru');
      productSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (b.cta === 'Buka Toko Sekarang') {
      router.push('/store-panel/settings');
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg select-none">
      <div
        className={`bg-gradient-to-r ${b.bg} transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          {b.pattern === 'circles' ? (
            <>
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
              <div className="absolute -right-8 -bottom-20 h-80 w-80 rounded-full bg-white/5" />
              <div className="absolute right-32 top-4 h-32 w-32 rounded-full bg-white/5" />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
            </>
          )}
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between px-8 py-10 md:py-12 md:px-12 gap-6 min-h-[200px] md:min-h-[220px]">
          {/* Text */}
          <div className="flex-1 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4 backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              {b.tag}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3 whitespace-pre-line">
              {b.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-md mb-6 leading-relaxed">
              {b.subtitle}
            </p>
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50 transition shadow-md cursor-pointer"
            >
              <Zap className="h-4 w-4 text-yellow-500" />
              {b.cta}
            </button>
          </div>

          {/* Emoji illustration */}
          <div className="shrink-0 hidden md:flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-6xl shadow-inner">
            {b.emoji}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-100 aspect-square" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────
const PAGE_SIZE = 20;

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
        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
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
              className={`h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium transition cursor-pointer ${
                p === page
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil((products?.length || 0) / PAGE_SIZE);
  const paginated = products?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* ── Banner Slider ── */}
        <BannerSlider />

        {/* ── Katalog Produk ── */}
        <section id="produk-terbaru">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Produk Terbaru
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isLoading
                  ? 'Memuat...'
                  : `${products?.length || 0} barang tersedia`}
              </p>
            </div>
            {!isLoading && totalPages > 1 && (
              <span className="text-xs text-gray-400">
                Hal {page} dari {totalPages}
              </span>
            )}
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && products?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Belum ada produk
              </h3>
              <p className="text-sm text-gray-400">
                Jadi yang pertama jualan di LangkaLoka!
              </p>
            </div>
          )}

          {/* Product grid */}
          {!isLoading && paginated && paginated.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginated.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
