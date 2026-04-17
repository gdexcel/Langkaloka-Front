"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { Header } from "@/components/views/Header";
import Link from "next/link";
import axios from "axios";
import {
  MapPin,
  Store,
  Tag,
  Heart,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[]; // 🔥 array, bukan single image
  category?: string;
  condition?: string;
  storeId: string;
  storeName?: string;
  storeLocation?: string;
  storeOwnerId: string;
  description?: string;
  isSold: boolean;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // 🔥 foto aktif

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: user } = useCurrentUser();
  const { data: favorites = [] } = useFavorites();
  const isOwner = user && product ? user.id === product.storeOwnerId : false;
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const isFavorite =
    product && favorites.some((fav: any) => fav.productId === product.id);

  // 🔥 Normalise: support images[] dan fallback ke image string lama
  const imageList: string[] =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || isSubmitting) return;
    setIsSubmitting(true);
    const url = isFavorite ? `/api/favorites/${id}` : "/api/favorites";
    const method = isFavorite ? "DELETE" : "POST";
    try {
      await axios({
        method,
        url,
        data: !isFavorite ? { productId: id } : undefined,
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } catch (error) {
      console.error("Toggle favorite error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-sm text-gray-500">Product not found</p>
        </div>
      </main>
    );
  }

  const markAsSoldorUnsold = async (value: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login dulu");
      return;
    }
    try {
      await axios.patch(
        `/api/products/${id}`,
        { isSold: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(
        value
          ? "Produk berhasil ditandai SOLD"
          : "Batalkan Tandai Terjual berhasil",
      );
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login dulu");
      return;
    }
    try {
      const res = await axios.post(
        "/api/chat/create",
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      router.push(`/chat/${res.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {/* === FOTO SECTION === */}
          <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              {imageList.length > 0 ? (
                <img
                  src={imageList[activeIndex]}
                  alt={product.name}
                  className="aspect-square w-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              {/* SOLD badge */}
              {product.isSold && (
                <div className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                  SOLD
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                disabled={!isAuthenticated || isSubmitting}
                title={
                  !isAuthenticated
                    ? "Login untuk menambahkan ke wishlist"
                    : "Toggle wishlist"
                }
                className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg border backdrop-blur-sm hover:bg-white hover:scale-105 transition-all text-gray-600 hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                )}
              </button>

              {/* Prev / Next — tampil kalau lebih dari 1 foto */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imageList.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeIndex
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip — tampil kalau lebih dari 1 foto */}
            {imageList.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imageList.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${
                      i === activeIndex
                        ? "border-gray-900 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* === INFO SECTION === */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    <Tag className="h-3.5 w-3.5" />
                    {product.category}
                  </span>
                )}
                {product.condition && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.condition}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                {product.name}
              </h1>

              <p className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Informasi Toko
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span>{product.storeName || "Nama toko tidak tersedia"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{product.storeLocation || "Lokasi belum diisi"}</span>
                </p>
              </div>
              <Link
                href={`/store/${product.storeId}`}
                className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Kunjungi Toko
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Deskripsi Produk
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description || "Belum ada deskripsi produk."}
              </p>
            </div>

            <div className="sticky bottom-3 z-10 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
              {!isOwner && (
                <button
                  onClick={handleChat}
                  className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Chat Seller
                </button>
              )}
              {isOwner && !product.isSold && (
                <button
                  onClick={() => markAsSoldorUnsold(true)}
                  className="w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Tandai Terjual
                </button>
              )}
              {isOwner && product.isSold && (
                <button
                  onClick={() => markAsSoldorUnsold(false)}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Batalkan Tandai Terjual
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
