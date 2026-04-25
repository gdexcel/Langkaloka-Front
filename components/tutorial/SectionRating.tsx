"use client";

import { useState } from "react";

const ratingLabels = [
  "",
  "Kurang banget 😞",
  "Bisa lebih baik 😐",
  "Lumayan oke 🙂",
  "Bagus banget! 😊",
  "Sempurna! 🌟",
];

export default function SectionRating() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const active = hovered || selected;

  return (
    <section id="rating" className="scroll-mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5-4-3.9 5.6-.8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Cara Rating</h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Beri penilaian jujur untuk toko
          </p>
        </div>
      </div>

      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 text-center">
        <p className="text-[13px] text-gray-500 mb-3">
          Masuk ke halaman toko, lalu tap bintang rating
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(n)}
              className="text-4xl transition-colors duration-100 focus:outline-none"
              style={{ color: n <= active ? "#F9A825" : "#DBEAFE" }}
            >
              ★
            </button>
          ))}
        </div>

        <p className="text-sm font-medium text-blue-700 min-h-5">
          {ratingLabels[active] || "Klik bintang untuk rating (1–5)"}
        </p>
        <p className="text-[11px] text-blue-300 mt-1.5">
          Berikan bintang sesuai kejujuranmu ✨
        </p>
      </div>
    </section>
  );
}
