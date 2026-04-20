//langkaloka-v1\app\store\[id]\page.tsx
"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { Header } from "@/components/views/Header";
import ProductCard from "@/components/products/ProductCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

const STAR_LABELS: Record<number, string> = {
  1: "Buruk",
  2: "Kurang",
  3: "Cukup",
  4: "Bagus",
  5: "Sangat Bagus",
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

  useEffect(() => {
    if (data?.userRating) {
      setSelectedRating(Number(data.userRating));
      setHasRated(true);
    }
  }, [data]);

  useEffect(() => {
    if (!data?.store?.ownerId) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const userId = getUserIdFromToken(token);
    setIsOwner(userId === data.store.ownerId);
  }, [data]);

  if (isLoading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (!data) return <p className="p-6 text-gray-400">Store not found</p>;

  const handleRate = async (star: number) => {
    if (hasRated) {
      alert("Kamu sudah memberi rating ⭐");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login dulu ya 🔐");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/store/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      alert("Gagal rating");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoveredRating || selectedRating;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* ── STORE INFO CARD ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            {data.store.image ? (
              <img
                src={data.store.image}
                className="w-20 h-20 rounded-full object-cover border shadow flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-yellow-600">
                {data.store.name?.charAt(0)}
              </div>
            )}

            {/* Konten */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.store.name}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {data.store.description}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                📍 {data.store.location || "Lokasi belum diisi"}
              </p>

              {/* ── RATING SECTION ── */}
              <div className="mt-4 flex flex-col sm:flex-row gap-6">
                {/* Kiri: Avg + Input Bintang */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-yellow-500">
                      {Number(data.avgRating || 0).toFixed(1)}
                    </span>
                    <span className="text-gray-300 text-lg">/5</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    {data.totalRatings} penilaian
                  </p>

                  {hasRated ? (
                    <div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-2xl ${star <= selectedRating ? "text-yellow-400" : "text-gray-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        ✔ Kamu sudah memberi rating
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Beri penilaianmu:
                      </p>
                      <div className="flex gap-0.5 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            disabled={loading}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className={`text-2xl transition-transform hover:scale-125 ${
                              star <= displayRating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                        {hoveredRating > 0 && (
                          <span className="ml-2 text-xs text-gray-500 font-medium">
                            {STAR_LABELS[hoveredRating]}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kanan: Breakdown Bars */}
                {data.totalRatings > 0 && (
                  <div className="flex flex-col justify-center gap-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = data.ratingPercentages?.[star] ?? 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-2 text-xs text-gray-500"
                        >
                          <span className="w-3 text-right">{star}</span>
                          <span className="text-yellow-400">★</span>
                          <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-gray-400 w-7">
                            {Math.round(pct)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT: Products (kiri) + Sticky VA (kanan) ── */}
        <div className="flex gap-6 items-start">
          {/* Produk */}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-600 mb-3">
              Produk Toko
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Sticky VA — selalu tampil */}
          <div className="w-64 flex-shrink-0 sticky top-6">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400">Informasi Pembayaran</p>
                {isOwner && (
                  <button
                    onClick={() => router.push("/store-panel/settings")}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>
              {data.store.vaNumber ? (
                <>
                  <p className="text-xs text-gray-500 mb-0.5">
                    {data.store.vaBank || "Bank"}
                  </p>
                  <p className="font-bold text-gray-800 text-base tracking-wide">
                    {data.store.vaNumber}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(data.store.vaNumber);
                      alert("VA disalin!");
                    }}
                    className="mt-3 w-full text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition font-medium"
                  >
                    Copy VA
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  Nomor VA belum tersedia
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
