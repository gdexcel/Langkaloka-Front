//langkaloka-v1\app\product\[id]\page.tsx
'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useFavorites } from '@/hooks/useFavorites';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { Header } from '@/components/views/Header';
import Link from 'next/link';
import axios from 'axios';
import {
  MapPin,
  Store,
  Tag,
  Heart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

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
  // 🔥 UPLOAD BUKTI
  const [showUpload, setShowUpload] = useState(false);
  const [alreadyUploaded, setAlreadyUploaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: user } = useCurrentUser();
  const { data: favorites = [] } = useFavorites();
  const isOwner = user && product ? user.id === product.storeOwnerId : false;
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isFavorite =
    product && favorites.some((fav: any) => fav.productId === product.id);
  useEffect(() => {
    const checkUpload = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`/api/transactions/me?productId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setAlreadyUploaded(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUpload();
  }, [id]);

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
    const url = isFavorite ? `/api/favorites/${id}` : '/api/favorites';
    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      await axios({
        method,
        url,
        data: !isFavorite ? { productId: id } : undefined,
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (error) {
      console.error('Toggle favorite error', error);
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login dulu');
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
          ? 'Produk berhasil ditandai SOLD'
          : 'Batalkan Tandai Terjual berhasil',
      );
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChat = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login dulu');
      return;
    }
    try {
      const res = await axios.post(
        '/api/chat/create',
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      router.push(`/chat/${res.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 HANDLE UPLOAD
  const handleUpload = async () => {
    if (!file) {
      alert('Pilih gambar dulu');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const reader = new FileReader();
      reader.readAsDataURL(file);

      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });

      // upload ke cloudinary
      const uploadRes = await axios.post('/api/upload', {
        image: base64,
      });

      const url = uploadRes.data.url;

      // simpan ke backend
      await axios.post(
        '/api/transactions',
        {
          productId: id,
          proof: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Bukti transfer berhasil dikirim!');
      setShowUpload(false);
      setFile(null);
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
            {/* Main image */}
            <div className="relative overflow-hidden rounded-xl bg-gray-100">
              {imageList.length > 0 ? (
                <img
                  src={imageList[activeIndex]}
                  alt={product.name}
                  onClick={() => setIsLightboxOpen(true)}
                  className="aspect-square w-full cursor-zoom-in object-cover transition-all duration-300"
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
                    ? 'Login untuk menambahkan ke wishlist'
                    : 'Toggle wishlist'
                }
                className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg border backdrop-blur-sm hover:bg-white hover:scale-105 transition-all text-gray-600 hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                )}
              </button>

              {/* Prev / Next */}
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

                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {imageList.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeIndex
                            ? 'w-4 bg-white'
                            : 'w-1.5 bg-white/50'
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
                        ? 'border-gray-900 opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
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
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
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
                  <span>{product.storeName || 'Nama toko tidak tersedia'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{product.storeLocation || 'Lokasi belum diisi'}</span>
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
                {product.description || 'Belum ada deskripsi produk.'}
              </p>
            </div>

            <div className="sticky bottom-3 z-10 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
              {!isOwner && !product.isSold && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleChat}
                    className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Chat Seller
                  </button>

                  <button
                    onClick={() => {
                      if (alreadyUploaded) {
                        alert('Kamu sudah mengirimkan bukti pembayaran');
                        return;
                      }
                      setShowUpload(true);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl mt-2"
                  >
                    Saya Sudah Bayar
                  </button>

                  {alreadyUploaded && (
                    <p className="text-xs text-green-600 text-center">
                      ✔ Bukti pembayaran sudah dikirim
                    </p>
                  )}
                </div>
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
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl space-y-4">
            <h2 className="font-bold">Upload Bukti Transfer</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (!e.target.files) return;

                const f = e.target.files[0];

                if (f.size > 2 * 1024 * 1024) {
                  alert('Max 2MB');
                  return;
                }

                setFile(f);
              }}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 border py-2 rounded"
              >
                Batal
              </button>

              <button
                onClick={handleUpload}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {isLightboxOpen && imageList.length > 0 && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center">
          {/* Close */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          {imageList.length > 1 && (
            <div className="absolute top-4 left-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              {activeIndex + 1} / {imageList.length}
            </div>
          )}

          {/* Prev */}
          {imageList.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div className="w-full h-full p-4 md:p-10 flex items-center justify-center">
            <img
              src={imageList[activeIndex]}
              alt={product.name}
              className="max-h-full max-w-full object-contain select-none"
            />
          </div>

          {/* Next */}
          {imageList.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}
