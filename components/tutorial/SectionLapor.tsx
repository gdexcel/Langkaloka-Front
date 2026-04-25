"use client";

import { useState } from "react";

const ADMIN_WA = "08123456789"; // Ganti dengan nomor admin asli

export default function SectionLapor() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_WA).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="lapor" className="scroll-mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12v-4m0-4h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Lapor ke Admin
          </h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Ada masalah? Hubungi kami via WhatsApp
          </p>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white text-sm font-bold py-3.5 px-5 rounded-xl transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C5.6 2 2 5.6 2 10c0 1.5.4 2.9 1.1 4.1L2 18l4-1.1C7.2 17.6 8.6 18 10 18c4.4 0 8-3.6 8-8s-3.6-8-8-8z"
            fill="rgba(255,255,255,0.25)"
          />
          <path
            d="M7 8.5c.3 2 2.5 4.2 4.5 4.5.7.1 1.2-.1 1.5-.5l.3-.7c.1-.2 0-.5-.2-.6l-1.2-.8c-.2-.1-.5-.1-.6.1l-.4.5c-.8-.4-1.7-1.3-2.1-2.1l.5-.4c.2-.2.2-.4.1-.6L8.6 7.2c-.1-.2-.4-.3-.6-.2l-.7.3C7.1 7.6 6.9 8 7 8.5z"
            fill="white"
          />
        </svg>
        Hubungi Admin via WhatsApp
      </button>

      {copied && (
        <p className="text-center text-xs text-blue-700 font-semibold mt-2">
          ✓ Nomor admin berhasil disalin!
        </p>
      )}
    </section>
  );
}
