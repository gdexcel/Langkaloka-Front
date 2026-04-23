// langkaloka-v1\app\store-panel\sell\page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Store, PlusCircle, ImagePlus, X } from "lucide-react";
import { InfoPopup } from "@/components/popup/InformasiPopupProductSeller";

type Category = {
  id: string;
  name: string;
};

const MAX_SLOTS = 4;

export default function SellPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("baik");
  const [imageSlots, setImageSlots] = useState<(File | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const [hasStore, setHasStore] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );

  useEffect(() => {
    const checkStoreAndCategories = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [storeRes, categoriesRes] = await Promise.all([
          axios.get("/api/stores/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/categories"),
        ]);
        if (!storeRes.data) {
          setHasStore(false);
          return;
        }
        setHasStore(true);
        setCategories(categoriesRes.data || []);
      } catch {
        setHasStore(false);
      }
    };
    checkStoreAndCategories();
  }, []);

  const handleSlotClick = (index: number) =>
    fileInputRefs.current[index]?.click();

  const handleFileChange = (index: number, file: File | null) => {
    if (!file) return;
    const newSlots = [...imageSlots];
    newSlots[index] = file;
    setImageSlots(newSlots);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...previews];
      newPreviews[index] = reader.result as string;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlot = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newSlots = [...imageSlots];
    const newPreviews = [...previews];
    newSlots[index] = null;
    newPreviews[index] = null;
    setImageSlots(newSlots);
    setPreviews(newPreviews);
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageSlots.filter(Boolean).length === 0) {
      alert("Minimal 1 foto harus diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // ✅ FIX: kirim { url, slotIndex } bukan array URL mentah
      // slotIndex = posisi slot asli di UI (0 = foto utama)
      // sehingga walau user skip slot tengah, order tetap benar di DB
      const imagePayload: { url: string; slotIndex: number }[] = [];

      for (let i = 0; i < imageSlots.length; i++) {
        const file = imageSlots[i];
        if (!file) continue; // slot kosong, skip

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const uploadRes = await axios.post("/api/upload", { image: base64 });

        imagePayload.push({
          url: uploadRes.data.url as string,
          slotIndex: i, // ← slot index asli, bukan index setelah filter
        });
      }

      await axios.post(
        "/api/products/create",
        {
          name,
          description,
          price: Number(price),
          condition,
          categoryId: categoryId || null,
          images: imagePayload, // ← { url, slotIndex }[]
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Produk berhasil dipublikasikan!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat produk. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // No store state
  if (!hasStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
          <Store className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Kamu belum punya toko
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Buat toko dulu untuk mulai berjualan
          </p>
        </div>
        <button
          onClick={() => router.push("/store-panel/settings")}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95"
        >
          Buat Toko Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Jual Produk
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          Tambah Produk
        </h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Lengkapi informasi produk agar mudah ditemukan.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* IMAGE SLOTS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="space-x-2">
              <label className="text-sm font-semibold text-gray-700">
                Foto Produk
              </label>
              <InfoPopup field="fotoProduk" />
            </div>

            <span className="text-xs text-gray-400">
              {imageSlots.filter(Boolean).length}/{MAX_SLOTS} foto
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: MAX_SLOTS }).map((_, index) => {
              const preview = previews[index];
              const isFirst = index === 0;
              return (
                <div key={index} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    onChange={(e) =>
                      handleFileChange(index, e.target.files?.[0] ?? null)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-150
                      ${
                        preview
                          ? "border-gray-200 shadow-sm"
                          : isFirst
                            ? "border-dashed border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-50"
                            : "border-dashed border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                  >
                    {preview ? (
                      <Image
                        src={preview}
                        alt={`Foto ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-1">
                        <ImagePlus
                          className={`h-5 w-5 ${isFirst ? "text-blue-400" : "text-gray-300"}`}
                        />
                        {isFirst && (
                          <span className="text-[10px] text-blue-400 font-medium">
                            Utama
                          </span>
                        )}
                      </div>
                    )}
                    {preview && (
                      <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                        {index + 1}
                      </span>
                    )}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSlot(e, index)}
                      className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            <span className="text-red-600 font-bold">BACA!,</span> Foto pertama
            jadi foto utama. <br />
            Upload foto sesuai urutan.
          </p>
        </div>

        {/* Nama */}
        <div className="flex flex-col gap-1.5">
          <div className="space-x-2">
            <label className="text-sm font-semibold text-gray-700">
              Nama Produk
            </label>
            <InfoPopup field="namaProduk" />
          </div>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="Contoh: Kaos Hitam Polos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-1.5">
          <div className="space-x-2">
            <label className="text-sm font-semibold text-gray-700">Harga</label>
            <InfoPopup field="harga" />
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
              Rp
            </span>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="0"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <div className="space-x-2">
            <label className="text-sm font-semibold text-gray-700">
              Deskripsi
            </label>
            <InfoPopup field="deskripsi" />
          </div>
          <textarea
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            placeholder="Ceritakan kondisi, ukuran, atau detail lain."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Kategori & Kondisi */}
        {/* ✅ Fix: tambah overflow-visible agar popup tidak ter-clip oleh grid cell */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 overflow-visible">
          <div className="flex flex-col gap-1.5 overflow-visible">
            {/* ✅ Fix: ganti space-x-2 → flex items-center gap-1.5 agar InfoPopup inline dengan label */}
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Kategori Gender
              </label>
              <InfoPopup field="kategoriGender" />
            </div>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">All</option>
              {categories
                .filter((c) => c.name.toLowerCase() !== "all")
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-1.5 overflow-visible">
            <div className="flex items-center gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Kondisi
              </label>
              <InfoPopup field="kondisi" />
            </div>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="baik">Baik</option>
              <option value="minus">Minus</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit as unknown as React.MouseEventHandler}
          disabled={isSubmitting}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Mengupload...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Publish Produk
            </>
          )}
        </button>
      </div>
    </div>
  );
}
