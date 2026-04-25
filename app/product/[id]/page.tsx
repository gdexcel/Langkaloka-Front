//langkaloka-v1\app\product\[id]\page.tsx
"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFavorites } from "@/hooks/useFavorites";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useProducts } from "@/hooks/useProducts";
import { useLightbox } from "@/hooks/useLightbox";
import { Header } from "@/components/views/Header";
import { LoginForm } from "@/components/views/fragments/LoginForm";
import ProductCard from "@/components/products/ProductCard";
import { TutorialPesanProduct } from "@/components/popup/TutorialPesanProduct"; // ← NEW
import Link from "next/link";
import axios from "axios";
import { Lightbox } from "@/components/ui/lightbox";
import {
  MapPin,
  Heart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  Store,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// ─── Helper ───────────────────────────────────────────────────────────────────
function truncateLocation(loc: string, maxWords = 3): string {
  if (!loc) return "";
  const words = loc.trim().split(/\s+/);
  return words.length <= maxWords
    ? loc
    : words.slice(0, maxWords).join(" ") + "...";
}

// ─── Login Guard Modal ────────────────────────────────────────────────────────
function LoginGuardModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900">
            Login dulu sayang 😄
          </p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
}

// ─── Store Card ───────────────────────────────────────────────────────────────
function StoreCard({
  product,
  shortLocation,
}: {
  product: any;
  shortLocation: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-100 flex items-center justify-center">
        {product.storeImage ? (
          <img
            src={product.storeImage}
            alt={product.storeName}
            className="h-full w-full object-cover"
          />
        ) : (
          <Store className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">
          {product.storeName || "Nama toko"}
        </p>
        {shortLocation && (
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            {shortLocation}
          </p>
        )}
        <Link
          href={`/store/${product.storeId}`}
          className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
          Kunjungi Toko →
        </Link>
      </div>
    </div>
  );
}

// ─── CTA Buttons ─────────────────────────────────────────────────────────────
function CTAButtons({
  isOwner,
  isSold,
  alreadyUploaded,
  onChat,
  onUpload,
  onMarkSold,
  onMarkUnsold,
}: {
  isOwner: boolean;
  isSold: boolean;
  alreadyUploaded: boolean;
  onChat: () => void;
  onUpload: () => void;
  onMarkSold: () => void;
  onMarkUnsold: () => void;
}) {
  if (isOwner && !isSold) {
    return (
      <button
        onClick={onMarkSold}
        className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.98]"
      >
        Tandai Terjual
      </button>
    );
  }
  if (isOwner && isSold) {
    return (
      <button
        onClick={onMarkUnsold}
        className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
      >
        Batalkan Tandai Terjual
      </button>
    );
  }
  if (isSold) {
    return (
      <div className="rounded-xl bg-gray-100 py-3 text-center text-sm font-semibold text-gray-400">
        Produk Sudah Terjual
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        onClick={onChat}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-600 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-[0.98] cursor-pointer"
      >
        <MessageCircle className="h-4 w-4 cursor-pointer" />
        Chat Seller
      </button>
      <button
        onClick={onUpload}
        className={`flex-1 rounded-xl py-3 text-sm font-semibold cursor-pointer text-white transition  active:scale-[0.98] ${
          alreadyUploaded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {alreadyUploaded ? "✔ Sudah Bayar" : "Saya Sudah Bayar"}
      </button>
    </div>
  );
}

// Sembunyikan Deskripsi
function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 150;

  return (
    <div>
      <p
        className={`whitespace-pre-wrap text-sm leading-relaxed text-gray-600 ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center cursor-pointer justify-center gap-1.5 border-t border-gray-100 pt-3 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          {expanded ? (
            <>
              Sembunyikan
              <ChevronLeft className="h-3.5 w-3.5 rotate-90" />
            </>
          ) : (
            <>
              Selengkapnya
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: allProducts = [] } = useProducts();
  const recommendations = [...allProducts]
    .sort(() => Math.random() - 0.5)
    .filter((p: any) => p.id !== id)
    .slice(0, 8);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showLoginGuard, setShowLoginGuard] = useState(false);

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: user } = useCurrentUser();
  const { data: favorites = [] } = useFavorites();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isAuthenticated = !!token;
  const isOwner = user && product ? user.id === product.storeOwnerId : false;
  const isFavorite =
    product && favorites.some((fav: any) => fav.productId === product.id);

  const imageList: string[] =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const {
    isOpen: isLightboxOpen,
    activeIndex,
    setActiveIndex,
    open: openLightbox,
    close: closeLightbox,
    prev: handlePrev,
    next: handleNext,
  } = useLightbox(imageList);

  useEffect(() => {
    const checkUpload = async () => {
      const t = localStorage.getItem("token");
      if (!t) return;
      try {
        const res = await axios.get(`/api/transactions/me?productId=${id}`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.data) setAlreadyUploaded(true);
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error(error);
        }
      }
    };
    checkUpload();
  }, [id]);

  const requireAuth = (fn: () => void) => {
    if (!isAuthenticated) {
      setShowLoginGuard(true);
      return;
    }
    fn();
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    requireAuth(async () => {
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
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const markAsSoldorUnsold = async (value: boolean) => {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      await axios.patch(
        `/api/products/${id}`,
        { isSold: value },
        { headers: { Authorization: `Bearer ${t}` } },
      );
      alert(
        value
          ? "Produk berhasil ditandai SOLD"
          : "Batalkan Tandai Terjual berhasil",
      );
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChat = () =>
    requireAuth(async () => {
      try {
        const res = await axios.post(
          "/api/chat/create",
          { productId: id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        router.push(`/chat/${res.data.id}`);
      } catch (err) {
        console.error(err);
      }
    });

  const handleSudahBayar = () =>
    requireAuth(() => {
      if (alreadyUploaded) {
        alert("Kamu sudah mengirimkan bukti pembayaran");
        return;
      }
      setShowUpload(true);
    });

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih gambar dulu");
      return;
    }
    try {
      const t = localStorage.getItem("token");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });
      const uploadRes = await axios.post("/api/upload", { image: base64 });
      await axios.post(
        "/api/transactions",
        { productId: id, proof: uploadRes.data.url },
        { headers: { Authorization: `Bearer ${t}` } },
      );
      alert("Bukti transfer berhasil dikirim!");
      setShowUpload(false);
      setFile(null);
      setAlreadyUploaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (productLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-gray-200 md:hidden" />
            <div className="h-6 w-2/3 rounded-lg bg-gray-200" />
            <div className="h-8 w-1/3 rounded-lg bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <p className="text-sm text-gray-500">Produk tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  const shortLocation = truncateLocation(product.storeLocation || "");

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* ── KONTEN UTAMA ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-0 pb-6 md:px-6 md:pt-6">
        <div className="md:grid md:grid-cols-[1fr_360px] md:items-start md:gap-6">
          {/* ── LEFT ──────────────────────────────────────────────────────────── */}
          <div>
            {/* Gambar utama */}
            <div className="relative overflow-hidden bg-white md:rounded-2xl">
              {imageList.length > 0 ? (
                <img
                  src={imageList[activeIndex]}
                  alt={product.name}
                  onClick={() => openLightbox(activeIndex)}
                  className="aspect-square w-full cursor-pointer object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-gray-100 text-sm text-gray-400">
                  Tidak ada foto
                </div>
              )}

              {/* SOLD badge */}
              {product.isSold && (
                <div className="absolute left-3 top-3 rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold tracking-wide text-white shadow">
                  TERJUAL
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-400"}`}
                  />
                )}
              </button>

              {/* Arrows */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {imageList.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {imageList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto bg-white px-3 pb-3 pt-2 md:rounded-b-2xl">
                {imageList.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === activeIndex
                        ? "border-blue-600 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Info produk — mobile */}
            <div className="mt-px bg-white px-4 py-4 md:hidden">
              <div className="mb-2 flex flex-wrap gap-2">
                {product.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </span>
                )}
                {product.condition && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.condition}
                  </span>
                )}
              </div>
              <h1 className="text-lg font-semibold leading-snug text-gray-900">
                {product.name}
              </h1>
              <p className="mt-1.5 text-xl font-bold text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>
            {/* Toko — mobile only */}
            <div className="mt-px bg-white px-4 py-4 md:hidden">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Informasi Toko
              </h2>
              <StoreCard product={product} shortLocation={shortLocation} />
            </div>

            {/* Trust badges — mobile only */}
            <div className="mt-px bg-white px-4 py-3 md:hidden">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
                  Transaksi via chat
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                  Seller cek produk sebelum kirim
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR (desktop) ───────────────────────────────────────── */}
          <div className="hidden md:flex md:flex-col md:gap-4">
            <div className="bg-white px-4 py-4 md:mt-4 md:rounded-2xl md:px-5">
              <div className="mb-2 flex flex-wrap gap-2">
                {product.category && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </span>
                )}
                {product.condition && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {product.condition}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-semibold leading-snug text-gray-900 md:text-2xl">
                {product.name}
              </h1>
              <p className="mt-2 text-xl font-bold text-blue-600 md:text-3xl">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(product.price)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              {/* ── [PLACEMENT 1] Desktop: di atas CTA buttons ─────────────────
                  Diletakkan di sini karena user yang mau transaksi
                  paling butuh panduan tepat sebelum klik tombol.      */}
              {!isOwner && !product.isSold && (
                <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                  <TutorialPesanProduct />
                  <span>Cara pesan</span>
                </div>
              )}
              <CTAButtons
                isOwner={isOwner}
                isSold={product.isSold}
                alreadyUploaded={alreadyUploaded}
                onChat={handleChat}
                onUpload={handleSudahBayar}
                onMarkSold={() => markAsSoldorUnsold(true)}
                onMarkUnsold={() => markAsSoldorUnsold(false)}
              />
              {!isOwner && !product.isSold && (
                <button
                  onClick={toggleFavorite}
                  className="mt-2 flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 transition hover:border-rose-200 hover:text-rose-500"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                  )}
                  {isFavorite ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                </button>
              )}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Informasi Toko
              </h2>
              <StoreCard product={product} shortLocation={shortLocation} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
                  Transaksi via chat
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
                  Seller cek produk sebelum kirim
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Deskripsi ──────────────────────────────────────────────────────── */}
        {/* ── [PLACEMENT 2] Di header "Deskripsi Produk" — muncul di mobile & desktop
            Paling relevan karena user yang baca deskripsi = user yang sedang
            mempertimbangkan beli → butuh tahu alur pemesanan.           */}
        <div className="mt-px bg-white px-4 py-4 md:mt-4 md:rounded-2xl md:px-5">
          <div className="mb-2 flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-gray-900">
              Deskripsi Produk
            </h2>
            {/* Icon ? muncul di semua ukuran layar */}
            <TutorialPesanProduct />
          </div>
          <ExpandableDescription
            text={product.description || "Belum ada deskripsi produk."}
          />
        </div>
      </div>

      {/* ── REKOMENDASI ──────────────────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-28 pt-2 md:pb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
              Rekomendasi Lainnya
            </h2>
            <Link
              href="/product/all"
              className="flex items-center gap-1.5 rounded-full border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:border-blue-400 hover:text-blue-800 active:scale-95"
            >
              Lihat Semua
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100">
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {recommendations.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── STICKY BOTTOM CTA (mobile) ───────────────────────────────────────── */}
      {/* ── [PLACEMENT 3] Mobile sticky bar: icon di kiri luar tombol
          Area paling sering dilihat user mobile saat mau transaksi.
          Hanya tampil kalau bukan owner & produk belum sold.           */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden">
        {!isOwner && !product.isSold && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
            <TutorialPesanProduct />
            <span>Cara pesan</span>
          </div>
        )}
        <CTAButtons
          isOwner={isOwner}
          isSold={product.isSold}
          alreadyUploaded={alreadyUploaded}
          onChat={handleChat}
          onUpload={handleSudahBayar}
          onMarkSold={() => markAsSoldorUnsold(true)}
          onMarkUnsold={() => markAsSoldorUnsold(false)}
        />
      </div>

      {/* ── MODAL UPLOAD ─────────────────────────────────────────────────────── */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowUpload(false)}
        >
          <div
            className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                Upload Bukti Transfer
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 text-gray-400 transition hover:border-blue-400 hover:text-blue-400">
              <Upload className="h-6 w-6" />
              <span className="text-center text-sm">
                {file ? file.name : "Pilih foto bukti transfer"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const f = e.target.files[0];
                  if (f.size > 2 * 1024 * 1024) {
                    alert("Max 2MB");
                    return;
                  }
                  setFile(f);
                }}
              />
            </label>
            <p className="text-center text-xs text-gray-400">
              Maks. ukuran file: 2MB
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Kirim Bukti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN GUARD ──────────────────────────────────────────────────────── */}
      {showLoginGuard && (
        <LoginGuardModal onClose={() => setShowLoginGuard(false)} />
      )}

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
      {isLightboxOpen && imageList.length > 0 && (
        <Lightbox
          images={imageList}
          activeIndex={activeIndex}
          productName={product.name}
          onClose={closeLightbox}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={setActiveIndex}
        />
      )}
    </main>
  );
}
