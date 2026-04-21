//langkaloka-v1\app\store-panel\products\[id]\edit\page.tsx
"use client";

import axios from "axios";
import { ChevronLeft, Loader2, PencilLine } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Category = { id: string; name: string };
const MAX_SLOTS = 4;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("baik");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSlots, setImageSlots] = useState<(File | string | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const [previews, setPreviews] = useState<(string | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );

  const fetchProduct = async () => {
    try {
      setIsFetching(true);
      const [productRes, categoriesRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get("/api/categories"),
      ]);
      const p = productRes.data;
      setName(p.name || "");
      setPrice(String(p.price || ""));
      setDescription(p.description || "");
      setCondition(p.condition || "baik");
      setCategoryId(p.categoryId || "");
      setCategories(categoriesRes.data || []);

      const existingImages: string[] = p.images || (p.image ? [p.image] : []);
      const newSlots: (string | null)[] = Array(MAX_SLOTS).fill(null);
      const newPreviews: (string | null)[] = Array(MAX_SLOTS).fill(null);
      existingImages.slice(0, MAX_SLOTS).forEach((url, i) => {
        newSlots[i] = url;
        newPreviews[i] = url;
      });
      setImageSlots(newSlots);
      setPreviews(newPreviews);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageSlots.filter(Boolean).length === 0) {
      alert("Minimal 1 foto harus diisi!");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const uploadPromises = imageSlots.map(async (slot) => {
        if (!slot) return null;
        if (typeof slot === "string") return slot;
        const reader = new FileReader();
        reader.readAsDataURL(slot);
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });
        const uploadRes = await axios.post("/api/upload", { image: base64 });
        return uploadRes.data.url as string;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      const imageUrls = uploadedUrls.filter(Boolean) as string[];
      await axios.patch(
        `/api/products/${id}/edit`,
        {
          name,
          price: Number(price),
          description,
          condition,
          categoryId: categoryId || null,
          images: imageUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Produk berhasil diupdate");
      router.push("/store-panel/products");
    } catch (error) {
      console.error(error);
      alert("Gagal update produk. Coba lagi.");
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
            <div className="h-32 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
            <div className="h-28 w-full animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <button
        onClick={() => router.push("/store-panel/products")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ChevronLeft className="h-4 w-4" /> Kembali ke Produk Saya
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
          {/* IMAGE SLOTS */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Foto Produk{" "}
              <span className="normal-case font-normal text-gray-400">
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
                        <img
                          src={preview}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
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
              Foto pertama akan jadi foto utama produk. Klik slot untuk ganti
              foto.
            </p>
          </div>

          {/* NAMA */}
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

          {/* HARGA */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Harga
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 250000"
              required
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Deskripsi
            </label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi, kelengkapan, atau detail penting produk."
            />
          </div>

          {/* KATEGORI & KONDISI */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Kategori
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
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
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Kondisi
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="buruk">Buruk</option>
                <option value="baik">Baik</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/store-panel/products")}
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
