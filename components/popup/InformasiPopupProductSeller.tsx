"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

type PopupKey =
  | "fotoProduk"
  | "namaProduk"
  | "harga"
  | "deskripsi"
  | "kategoriGender"
  | "kondisi";

const POPUP_CONTENT: Record<PopupKey, React.ReactNode> = {
  fotoProduk: (
    <div className="space-y-2">
      <p>
        Saya merekomendasikan seller untuk menggunakan foto produk dengan{" "}
        <strong>pencahayaan terang dan jelas</strong> agar buyer dapat melihat
        dengan detail.
      </p>
      <p>Ambil dari beberapa sudut agar pembeli bisa melihat kondisi barang.</p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Foto pertama akan menjadi foto utama produk.
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
  namaProduk: (
    <div className="space-y-2">
      <p>
        Saya merekomendasikan seller untuk menuliskan nama produk dengan{" "}
        <strong>jelas, singkat, dan mudah dipahami</strong> agar buyer lebih
        mudah menemukan produk Anda.
      </p>
      <p>
        Gunakan informasi penting seperti jenis barang, brand, warna, ukuran,
        atau model produk.
      </p>
      <p className="italic text-gray-400">
        Contoh: Kemeja Flanel (brand/merk) Pria Size L Navy
      </p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Nama produk yang detail berpotensi lebih cepat
        ditemukan buyer.
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
  harga: (
    <div className="space-y-2">
      <p>
        Saya merekomendasikan seller untuk mengisi harga sesuai{" "}
        <strong>kondisi dan nilai produk</strong> agar buyer lebih percaya saat
        melihat penawaran Anda.
      </p>
      <p>
        Lakukan riset harga pasar jika diperlukan agar produk tetap kompetitif
        dan menarik perhatian buyer.
      </p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Masukkan angka tanpa simbol atau titik.
        <br />
        Contoh: <strong>150000</strong> (seratus lima puluh ribu)
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
  deskripsi: (
    <div className="space-y-2">
      <p>
        Saya merekomendasikan seller untuk menjelaskan produk secara{" "}
        <strong>detail</strong> agar buyer memahami kondisi barang sebelum
        melakukan pembelian.
      </p>
      <p>
        Tuliskan informasi seperti ukuran, bahan, warna, kelengkapan,
        kekurangan, dan kondisi fisik produk.
      </p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Deskripsi yang jelas dapat mengurangi pertanyaan
        berulang dari buyer.
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
  kategoriGender: (
    <div className="space-y-2">
      <p>
        Saya menyarankan kolom ini dipilih jika produkmu berkaitan dengan{" "}
        <strong>fashion</strong>, jika bukan pilih All (tapi bebas sih).
      </p>
      <p>
        Pilih kategori seperti Pria, Wanita, Unisex, atau Anak berdasarkan jenis
        penggunaan produk.
      </p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Jika produk dapat digunakan semua gender, pilih
        kategori <strong>All</strong>.
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
  kondisi: (
    <div className="space-y-2">
      <p>
        Saya merekomendasikan seller untuk memilih kondisi produk dengan{" "}
        <strong>jujur</strong>.
      </p>
      <p>
        • <strong>Baik</strong> — sedikit/tidak ada kerusakan, sangat layak
        pakai
      </p>
      <p>
        • <strong>Minus</strong> — terdapat kerusakan, namun masih layak pakai
      </p>
      <p className="rounded-lg bg-blue-50 px-2 py-1.5 text-blue-600">
        <strong>Note:</strong> Kejujuran kondisi produk membantu membangun
        reputasi toko Anda.
      </p>
      <p className="pt-1 text-center text-[10px] text-gray-400">
        – Terimakasih banyak sudah berjualan di Langkaloka –
      </p>
    </div>
  ),
};

export function InfoPopup({ field }: { field: PopupKey }) {
  const [open, setOpen] = useState(false);
  // ✅ Fix: pisahkan ref untuk mobile dan desktop
  const mobilePopupRef = useRef<HTMLDivElement>(null);
  const desktopPopupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const insideMobile = mobilePopupRef.current?.contains(target) ?? false;
      const insideDesktop = desktopPopupRef.current?.contains(target) ?? false;
      const insideButton = buttonRef.current?.contains(target) ?? false;

      if (!insideMobile && !insideDesktop && !insideButton) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction, true);
    document.addEventListener("touchstart", handleOutsideInteraction, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction, true);
      document.removeEventListener(
        "touchstart",
        handleOutsideInteraction,
        true,
      );
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-blue-400 text-blue-500 transition hover:bg-blue-50 active:scale-95"
      >
        <span className="text-[10px] font-bold leading-none">i</span>
      </button>

      {open && (
        <>
          {/* ✅ Mobile & Tablet: ref mobilePopupRef → konten tampil benar */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-5 md:hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div
              ref={mobilePopupRef}
              className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-gray-100"
            >
              <div className="relative text-xs leading-relaxed text-gray-600">
                {POPUP_CONTENT[field]}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute -right-1 -top-1 text-gray-300 transition hover:text-gray-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Desktop: ref desktopPopupRef */}
          <div
            ref={desktopPopupRef}
            className="absolute left-0 top-6 z-50 hidden w-72 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-100 md:block"
          >
            <div className="absolute -top-1.5 left-1.5 h-3 w-3 rotate-45 rounded-sm bg-white ring-1 ring-gray-100" />
            <div className="relative text-xs leading-relaxed text-gray-600">
              {POPUP_CONTENT[field]}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute -right-1 -top-1 text-gray-300 transition hover:text-gray-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
