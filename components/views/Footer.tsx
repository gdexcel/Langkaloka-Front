//langkaloka-v1\components\views\Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useAuthModal } from "@/app/providers";

function GuardedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { openLogin } = useAuthModal();

  const handleClick = (e: React.MouseEvent) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      e.preventDefault();
      toast.error("Login dulu untuk mengakses halaman ini");
      openLogin(); // ← ini yang kurang
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
export function Footer() {
  const linkClass =
    "text-xs text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap";

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Top: Brand + Nav */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image
                src="/langkaLoka-logo.png"
                alt="LangkaLoka"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-sm font-black text-gray-900 tracking-tight">
                LangkaLoka
              </span>
            </Link>
            <p className="text-xs text-gray-400 max-w-[160px] leading-relaxed">
              Produk preloved, thrift, dan handmade
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex gap-8 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex flex-col gap-2 min-w-fit">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                Belanja
              </p>
              <Link href="/product/all" className={linkClass}>
                Semua Produk
              </Link>
              <Link href="/search" className={linkClass}>
                Cari Barang
              </Link>
              <GuardedLink href="/wishlist" className={linkClass}>
                Wishlist
              </GuardedLink>
            </div>

            <div className="flex flex-col gap-2 min-w-fit">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                Jualan
              </p>
              <GuardedLink href="/create-store" className={linkClass}>
                Buka Toko
              </GuardedLink>
              <GuardedLink href="/store-panel" className={linkClass}>
                Store Panel
              </GuardedLink>
              <GuardedLink href="/store-panel/sell" className={linkClass}>
                Tambah Produk
              </GuardedLink>
            </div>

            <div className="flex flex-col gap-2 min-w-fit">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                Bantuan
              </p>
              <Link href="/tutorial" className={linkClass}>
                Cara Beli
              </Link>
              <Link href="/tutorial" className={linkClass}>
                Cara Bayar
              </Link>
              <Link href="/tutorial" className={linkClass}>
                Cara Jualan
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-100" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-400 order-2 sm:order-1">
            © {new Date().getFullYear()} LangkaLoka
          </p>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <Link
              href="/feedback"
              className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
            >
              Feedback
            </Link>
            <Link
              href="/tutorial"
              className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors"
            >
              Tutorial
            </Link>
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
