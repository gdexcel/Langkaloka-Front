//langkaloka-v1\app\store-panel\sell\page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      const imageUrls: string[] = [];
      for (const file of imageSlots) {
        if (!file) continue;
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const uploadRes = await axios.post("/api/upload", { image: base64 });
        imageUrls.push(uploadRes.data.url as string);
      }
      await axios.post(
        "/api/products/create",
        {
          name,
          description,
          price: Number(price),
          condition,
          categoryId: categoryId || null,
          images: imageUrls,
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

  if (!hasStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-6xl">🏪</div>
        <h2 className="text-2xl font-bold">Kamu belum punya toko</h2>
        <p className="text-gray-500">Buat toko dulu untuk mulai berjualan</p>
        <button
          onClick={() => router.push("/store-panel/settings")}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Buat Toko Sekarang
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 md:px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Jual Barang</h1>
          <p className="text-sm text-gray-500 mb-6">
            Lengkapi informasi produk agar pembeli lebih mudah menemukan
            barangmu.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* IMAGE SLOTS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Produk{" "}
                <span className="text-gray-400 font-normal">
                  ({imageSlots.filter(Boolean).length}/{MAX_SLOTS})
                </span>
              </label>
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
                        className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150 ${preview ? "border-gray-900 shadow-sm" : isFirst ? "border-dashed border-gray-400 hover:border-gray-600 bg-gray-50 hover:bg-gray-100" : "border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"}`}
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
                            <svg
                              className={`w-5 h-5 ${isFirst ? "text-gray-500" : "text-gray-300"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            {isFirst && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                Utama
                              </span>
                            )}
                          </div>
                        )}
                        {preview && (
                          <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                            {index + 1}
                          </span>
                        )}
                      </button>
                      {preview && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSlot(e, index)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition z-10"
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
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Foto pertama akan jadi foto utama produk. Minimal 1 foto.
              </p>
            </div>

            {/* NAMA */}
            <input
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
              placeholder="Nama barang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* HARGA */}
            <input
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
              placeholder="Harga"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            {/* DESKRIPSI */}
            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 min-h-[120px] resize-none"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* KATEGORI & KONDISI */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {/* ✅ Default "All" — value kosong = null di DB */}
                <option value="">All</option>
                {categories
                  .filter((c) => c.name.toLowerCase() !== "all")
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <select
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 bg-white"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="buruk">Buruk</option>
                <option value="baik">Baik</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mengupload..." : "Publish Product"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
