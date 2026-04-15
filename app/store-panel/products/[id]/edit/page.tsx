'use client';

import axios from 'axios';
import { ChevronLeft, Loader2, PencilLine } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = async () => {
    try {
      setIsFetching(true);
      const res = await axios.get(`/api/products/${id}`);
      const p = res.data;

      setName(p.name || '');
      setPrice(String(p.price || ''));
      setDescription(p.description || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');

      await axios.patch(
        `/api/products/${id}/edit`,
        {
          name,
          price: Number(price),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Produk berhasil diupdate');
      router.push('/store-panel/products');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-28 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <button
        onClick={() => router.push('/store-panel/products')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke Produk Saya
      </button>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Edit Produk
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Perbarui Informasi Produk
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pastikan nama, harga, dan deskripsi tetap jelas agar pembeli mudah
            memahami produk.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Nama Produk
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kamera Analog Canon"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Harga
            </label>
            <input
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 250000"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Deskripsi
            </label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi, kelengkapan, atau detail penting produk."
            />
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push('/store-panel/products')}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <PencilLine className="h-4 w-4" />
                  Update Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
