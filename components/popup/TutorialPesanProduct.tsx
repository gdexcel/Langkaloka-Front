//langkaloka-v1\components\popup\TutorialPesanProduct.tsx
//langkaloka-v1\components\popup\TutorialPesanProduct.tsx
"use client";

import { useState } from "react";
import {
  X,
  HelpCircle,
  MessageCircle,
  CreditCard,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Chat Seller",
    desc: 'Klik tombol "Chat Seller" untuk tanya kondisi, negosiasi harga, atau konfirmasi ketersediaan produk.',
  },
  {
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    title: "Transfer Pembayaran",
    desc: "Sepakat harga? Transfer ke rekening seller sesuai info yang diberikan di chat.",
  },
  {
    icon: PackageCheck,
    color: "text-violet-500",
    bg: "bg-violet-50",
    title: "Upload Bukti Bayar",
    desc: 'Klik "Saya Sudah Bayar" lalu upload foto bukti transfer. Seller akan segera dikonfirmasi.',
  },
  {
    icon: ShieldCheck,
    color: "text-orange-500",
    bg: "bg-orange-50",
    title: "Produk Dikirim",
    desc: "Setelah seller konfirmasi pembayaran, produk akan diproses dan dikirim ke alamat kamu.",
  },
];

interface TutorialPesanProductProps {
  /** Kelas tambahan untuk wrapper trigger button */
  className?: string;
}

export function TutorialPesanProduct({
  className = "",
}: TutorialPesanProductProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Cara pesan produk ini"
        className={`inline-flex items-center justify-center rounded-full text-gray-400 transition hover:text-blue-500 active:scale-95 ${className}`}
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      {/* ── Backdrop ───────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-[800] flex items-end justify-center bg-black/50 px-0 pb-0 sm:items-center sm:px-4 sm:pb-4"
          onClick={() => setOpen(false)}
        >
          {/* ── Panel ──────────────────────────────────────────────────────── */}
          <div
            className="
              w-full max-w-sm rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-2xl
              sm:rounded-2xl sm:pb-6
              animate-in slide-in-from-bottom-4 duration-200
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Cara Pesan
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ikuti langkah berikut untuk transaksi aman
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Steps */}
            <ol className="space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    {/* Nomor + icon */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${step.bg}`}
                      >
                        <Icon className={`h-4 w-4 ${step.color}`} />
                      </div>
                      {/* Connector line */}
                      {i < steps.length - 1 && (
                        <span className="absolute left-1/2 top-9 h-4 w-px -translate-x-1/2 bg-gray-100" />
                      )}
                    </div>
                    {/* Text */}
                    <div className="pt-1 pb-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Footer note
            <div className="mt-1 rounded-xl bg-blue-50 px-3 py-2.5">
              <p className="text-center text-xs text-blue-600">
                Butuh bantuan? Hubungi admin lewat tombol chat di halaman utama.
              </p>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
