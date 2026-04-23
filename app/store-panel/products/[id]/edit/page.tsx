// langkaloka-v1\app\product\[id]\edit\page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { PlusCircle, ImagePlus, X } from "lucide-react";
import { InfoPopup } from "@/components/popup/InformasiPopupProductSeller";

type Category = {
  id: string;
  name: string;
};

const MAX_SLOTS = 4;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(MAX_SLOTS).fill(null),
  );

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !productId) return;
      try {
        const [productRes, categoriesRes] = await Promise.all([
          axios.get(`/api/products/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/categories"),
        ]);

        const product = productRes.data;
        setName(product.name || "");
        setPrice(String(product.price || ""));
        setDescription(product.description || "");
        setCondition(product.condition || "baik");
        setCategoryId(product.categoryId || "");
        setCategories(categoriesRes.data || []);

        // Load existing images into previews
        if (product.images && Array.isArray(product.images)) {
          const newPreviews: (string | null)[] = Array(MAX_SLOTS).fill(null);
          product.images
            .slice(0, MAX_SLOTS)
            .forEach((url: string, i: number) => {
              newPreviews[i] = url;
            });
          setPreviews(newPreviews);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data produk.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [productId, router]);

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
    if (previews.filter(Boolean).length === 0) {
      alert("Minimal 1 foto harus diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const imageUrls: string[] = [];

      for (let i = 0; i < MAX_SLOTS; i++) {
        const file = imageSlots[i];
        const preview = previews[i];

        if (!preview) continue;

        if (file) {
          // New file — upload it
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          const uploadRes = await axios.post("/api/upload", { image: base64 });
          imageUrls.push(uploadRes.data.url as string);
        } else {
          // Existing URL — reuse it
          imageUrls.push(preview);
        }
      }

      //EditSubmit Button
      await axios.patch(
        `/api/products/${productId}/edit`,
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
      alert("Produk berhasil diperbarui!");
      router.push(`/product/${productId}`);
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui produk. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Edit Produk
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          Ubah Informasi Produk
        </h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Perbarui detail produk agar tetap akurat dan menarik.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* IMAGE SLOTS */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="space-x-2">
              <label className="text-sm font-semibold text-gray-700">
                Foto Produk
              </label>
              <InfoPopup field="fotoProduk" />
            </div>
            <span className="text-xs text-gray-400">
              {previews.filter(Boolean).length}/{MAX_SLOTS} foto
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
            jadi foto utama. Minimal 1 foto.
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
            placeholder="Contoh: Kemeja flanel oversized"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-1.5">
          <div className="space-x-2">
            <label className="text-sm font-semibold text-gray-700">harga</label>
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
            placeholder="Ceritakan kondisi, ukuran, atau detail lain..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Kategori & Kondisi */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <div className="space-x-2">
              <label className="text-sm font-semibold text-gray-700">
                Kategori gender
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

          <div className="flex flex-col gap-1.5">
            <div className="space-x-2">
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
              Menyimpan...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  );
}
