//langkaloka-v1\app\store\[id]\page.tsx
"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/hooks/useStore";
import { Header } from "@/components/views/Header";
import ProductCard from "@/components/products/ProductCard";
import { useState, useEffect } from "react";

export default function StorePage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, refetch } = useStore(id);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD RATING DARI DB (AUTO PERSIST)
  useEffect(() => {
    if (data?.userRating) {
      setSelectedRating(Number(data.userRating));
      setHasRated(true);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Store not found</p>;

  // 🔥 HANDLE RATE
  const handleRate = async (star: number) => {
    // 🔒 BLOCK kalau sudah rating
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
        body: JSON.stringify({
          storeId: data.store.id,
          rating: star,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        return;
      }

      // 🔥 UPDATE UI + LOCK
      setSelectedRating(star);
      setHasRated(true);

      // 🔥 REFRESH AVG RATING
      await refetch();

      alert(`⭐ Terima kasih sudah memberi ${star} bintang!`);
    } catch (error) {
      console.error(error);
      alert("Gagal rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        {/* STORE INFO */}
        <div className="flex items-start gap-4 mb-8">
          {/* FOTO */}
          {data.store.image ? (
            <img
              src={data.store.image}
              className="w-20 h-20 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
          )}

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-bold">{data.store.name}</h1>

            {/* ⭐ AVG */}
            <div className="mt-2">
              {/* ⭐ AVG */}
              <div className="flex items-center gap-2">
                <p className="text-yellow-500 text-lg font-bold">
                  ⭐ {Number(data.avgRating || 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">/ 5</p>
              </div>

              {/* TOTAL */}
              <p className="text-xs text-gray-400">
                {data.totalRatings} penilaian
              </p>
            </div>

            <p className="text-gray-500">{data.store.description}</p>

            {/* ⭐ RATING */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={loading || hasRated}
                  onClick={() => handleRate(star)}
                  className={`
                    text-2xl transition
                    ${
                      star <= selectedRating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                    ${
                      hasRated
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }
                  `}
                >
                  ★
                </button>
              ))}
            </div>

            {/* 🔥 STATUS */}
            {hasRated && (
              <p className="text-xs text-green-600 mt-1">
                ✔ Kamu sudah memberi rating
              </p>
            )}

            {/* 📍 LOKASI */}
            <p className="text-sm text-gray-400 mt-2">
              📍 {data.store.location || "Lokasi belum diisi"}
            </p>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
