//langkaloka-v1\app\store\[id]\page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/views/Header';
import ProductCard from '@/components/products/ProductCard';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

const STAR_LABELS: Record<number, string> = {
  1: 'Buruk',
  2: 'Kurang',
  3: 'Cukup',
  4: 'Bagus',
  5: 'Sangat Bagus',
};

export default function StorePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, refetch } = useStore(id);
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'info'>('products');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.userRating) {
      setSelectedRating(Number(data.userRating));
      setHasRated(true);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.store?.ownerId) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const userId = getUserIdFromToken(token);
    setIsOwner(userId === data.store.ownerId);
  }, [data]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#2255CC] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memuat toko…</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">🏪</div>
          <p className="text-gray-500 font-medium">Toko tidak ditemukan</p>
        </div>
      </div>
    );

  const handleRate = async (star: number) => {
    if (hasRated) {
      alert('Kamu sudah memberi rating ⭐');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login dulu ya 🔐');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/store/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId: data.store.id, rating: star }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error);
        return;
      }

      setSelectedRating(star);
      setHasRated(true);
      await refetch();
      alert(`⭐ Terima kasih sudah memberi ${star} bintang!`);
    } catch (error) {
      console.error(error);
      alert('Gagal rating');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(data.store.vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayRating = hoveredRating || selectedRating;

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <Header />

      {/* ── STORE HERO BANNER ── */}
      <div className="relative bg-gradient-to-br from-[#1A3C8F] via-[#2255CC] to-[#4B80F0] h-36 sm:h-44">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px),
              radial-gradient(circle at 50% 80%, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── STORE IDENTITY CARD ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-14 sm:-mt-16 mb-4">
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
            <div className="flex items-end gap-4 -mt-12 sm:-mt-14 mb-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {data.store.image ? (
                  <img
                    src={data.store.image}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    alt={data.store.name}
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1A3C8F] to-[#4B80F0] rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-white">
                    {data.store.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Spacer for mobile badge row */}
              <div className="flex-1 flex justify-end pb-1">
                {isOwner && (
                  <button
                    onClick={() => router.push('/store-panel/settings')}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#2255CC]/10 text-[#2255CC] px-3 py-1.5 rounded-full hover:bg-[#2255CC]/20 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Kelola Toko
                  </button>
                )}
              </div>
            </div>

            {/* Store Name + Meta */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {data.store.name}
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {data.store.description || 'Tidak ada deskripsi'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <svg
                  className="w-3.5 h-3.5 text-[#2255CC] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-gray-400">
                  {data.store.location || 'Lokasi belum diisi'}
                </span>
              </div>
            </div>

            {/* ── RATING SUMMARY ROW ── */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
              {/* Score */}
              <div className="flex items-center gap-2">
                <div className="bg-[#2255CC] text-white text-sm font-black px-2.5 py-1 rounded-lg">
                  {Number(data.avgRating || 0).toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= Math.round(data.avgRating || 0) ? 'text-[#2255CC]' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {data.totalRatings} ulasan
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-100 hidden sm:block" />

              {/* Rating Breakdown (desktop) */}
              {data.totalRatings > 0 && (
                <div className="hidden sm:flex flex-col gap-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = data.ratingPercentages?.[star] ?? 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-1.5 text-[10px] text-gray-400"
                      >
                        <span className="w-2">{star}</span>
                        <svg
                          className="w-2.5 h-2.5 text-[#2255CC]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2255CC] rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6">{Math.round(pct)}%</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* User Rating Input */}
              <div className="ml-auto">
                {hasRated ? (
                  <div className="text-right">
                    <div className="flex gap-0.5 justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= selectedRating ? 'text-[#2255CC]' : 'text-gray-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[10px] text-green-600 font-semibold mt-0.5">
                      ✔ Sudah dinilai
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 text-right">
                      Nilai toko ini:
                    </p>
                    <div className="flex gap-0.5 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          disabled={loading}
                          onClick={() => handleRate(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="group relative"
                          title={STAR_LABELS[star]}
                        >
                          <svg
                            className={`w-6 h-6 transition-all duration-150 group-hover:scale-125 ${star <= displayRating ? 'text-[#2255CC]' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                      {hoveredRating > 0 && (
                        <span className="ml-1 text-[10px] text-gray-500 font-semibold">
                          {STAR_LABELS[hoveredRating]}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB NAV (Mobile) ── */}
        <div className="flex lg:hidden bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'products' ? 'bg-[#2255CC] text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🛍️ Produk
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'info' ? 'bg-[#2255CC] text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            💳 Pembayaran
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex gap-5 items-start pb-10">
          {/* Products Panel */}
          <div
            className={`flex-1 min-w-0 ${activeTab === 'info' ? 'hidden lg:block' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Semua Produk
              </h2>
              <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm font-medium">
                {data.products.length} item
              </span>
            </div>

            {data.products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-gray-400 text-sm">Belum ada produk</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {data.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Payment Info Sidebar */}
          <div
            className={`lg:w-60 w-full flex-shrink-0 lg:sticky lg:top-6 ${activeTab === 'products' ? 'hidden lg:block' : ''}`}
          >
            {/* VA Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Pembayaran
                </p>
                {isOwner && (
                  <button
                    onClick={() => router.push('/store-panel/settings')}
                    className="text-[11px] text-[#2255CC] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {data.store.vaNumber ? (
                <div>
                  <div className="bg-gradient-to-br from-[#1A3C8F] to-[#4B80F0] rounded-xl p-4 text-white mb-3">
                    <p className="text-[10px] font-semibold opacity-75 uppercase tracking-widest mb-1">
                      {data.store.vaBank || 'Virtual Account'}
                    </p>
                    <p className="text-lg font-black tracking-wider leading-none">
                      {data.store.vaNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyVA}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-[#2255CC]/10 text-[#2255CC] hover:bg-[#2255CC] hover:text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Salin Nomor VA
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">💳</div>
                  <p className="text-xs text-gray-400">
                    Nomor VA belum tersedia
                  </p>
                </div>
              )}
            </div>

            {/* Rating Breakdown Card (mobile in info tab) */}
            {data.totalRatings > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 lg:hidden">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Breakdown Rating
                </p>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = data.ratingPercentages?.[star] ?? 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <span className="w-3 text-right font-semibold">
                          {star}
                        </span>
                        <svg
                          className="w-3 h-3 text-[#2255CC] flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2255CC] rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right">
                          {Math.round(pct)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
