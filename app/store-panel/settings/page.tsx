'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MeData {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  image: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function StoreSettingsPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/store/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = res.data;
      if (store) {
        setMe(store);
        setName(store.name);
        setDescription(store.description || '');
        setLocation(store.location || '');
      }
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const hasStore = !!me;

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const imageBase64 = image ? await toBase64(image) : undefined;
      await axios.post(
        '/api/store/create',
        { name, description, location, image: imageBase64 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchStore();
      setSuccess(true);
      setTimeout(() => {
        router.push('/store-panel');
      }, 1200);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentImage = preview || me?.image || null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          {hasStore ? 'Perbarui Toko' : 'Buat Toko Baru'}
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {hasStore
            ? 'Edit informasi toko preloved kamu'
            : 'Isi data di bawah untuk mulai berjualan'}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-5">
        {/* Photo Upload */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors flex-shrink-0 group bg-white"
          >
            {currentImage ? (
              <Image
                src={currentImage}
                alt="Store"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 group-hover:text-blue-400 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm4.5-6H6a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V8.25A2.25 2.25 0 0018 6z"
                  />
                </svg>
              </div>
            )}
            {currentImage && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                  />
                </svg>
              </div>
            )}
          </button>

          <div>
            <p className="text-sm font-medium text-gray-700">
              {currentImage ? 'Foto toko dipilih' : 'Foto Toko'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG, WebP. Maks 5MB.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {currentImage ? 'Ganti foto →' : 'Pilih foto →'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Nama Toko */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">
            Nama Toko <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5A.75.75 0 0114.25 12h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72"
                />
              </svg>
            </div>
            <input
              required
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Preloved Sandro"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">
            Deskripsi
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan sedikit tentang toko kamu..."
          />
        </div>

        {/* Lokasi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500">Lokasi</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <input
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Bandung, Jawa Barat"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-70"
          style={{
            background: success
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 60%, #7c3aed 100%)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              Tersimpan! Mengalihkan...
            </span>
          ) : hasStore ? (
            'Perbarui Toko'
          ) : (
            'Buat Toko Sekarang'
          )}
        </button>
      </form>
    </div>
  );
}
