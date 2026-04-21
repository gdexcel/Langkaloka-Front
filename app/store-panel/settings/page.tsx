// langkaloka-v1\app\store-panel\settings\page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, MapPin, Store, CreditCard, CheckCircle2 } from "lucide-react";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [vaNumber, setVaNumber] = useState("");
  const [vaBank, setVaBank] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const store = res.data;
      if (store) {
        setMe(store);
        setName(store.name);
        setDescription(store.description || "");
        setLocation(store.location || "");
        setVaNumber(store.vaNumber || "");
        setVaBank(store.vaBank || "");
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
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const imageBase64 = image ? await toBase64(image) : undefined;
      await axios.post(
        "/api/store/create",
        { name, description, location, image: imageBase64, vaNumber, vaBank },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchStore();
      setSuccess(true);
      setTimeout(() => {
        router.push("/store-panel");
      }, 1200);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentImage = preview || me?.image || null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Pengaturan
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          {hasStore ? "Pengaturan Toko" : "Buat Toko Baru"}
        </h1>
        <p className="mt-0.5 text-sm text-gray-400">
          {hasStore
            ? "Perbarui informasi dan tampilan toko kamu."
            : "Isi data di bawah untuk mulai berjualan."}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-5">
        {/* Photo Upload */}
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white transition-colors hover:border-blue-400"
          >
            {currentImage ? (
              <>
                <Image
                  src={currentImage}
                  alt="Store"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-300 transition-colors group-hover:text-blue-400">
                <Camera className="h-5 w-5" />
              </div>
            )}
          </button>

          <div>
            <p className="text-sm font-semibold text-gray-700">
              {currentImage ? "Foto dipilih" : "Foto Toko"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WebP. Maks 5MB.</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              {currentImage ? "Ganti foto →" : "Pilih foto →"}
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
          <label className="text-sm font-semibold text-gray-700">
            Nama Toko <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Toko"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">
            Deskripsi
          </label>
          <textarea
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tentang toko kamu..."
          />
        </div>

        {/* Lokasi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Lokasi</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Bekasi"
            />
          </div>
        </div>

        {/* Virtual Account */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-semibold text-gray-700">
              Virtual Account / Rekening
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">
                Bank
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={vaBank}
                onChange={(e) => setVaBank(e.target.value)}
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BRI">BRI</option>
                <option value="BNI">BNI</option>
                <option value="MANDIRI">Mandiri</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">
                Nomor VA/Rekening
              </label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                value={vaNumber}
                onChange={(e) => setVaNumber(e.target.value)}
                placeholder="Nomor Virtual Account/Rekening"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-70
            ${
              success
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
            }`}
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Menyimpan...
            </span>
          ) : success ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tersimpan! Mengalihkan...
            </span>
          ) : hasStore ? (
            "Perbarui Toko"
          ) : (
            "Buat Toko Sekarang"
          )}
        </button>
      </form>
    </div>
  );
}
