//FILE INI TIDAK TERPAKAI!

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────
export interface SliderCardData {
  id: number;
  type: "explore" | "sell" | "payment";
  searchPlaceholder: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref?: string;
  ctaAction?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────
export const sliderData: SliderCardData[] = [
  {
    id: 1,
    type: "explore",
    searchPlaceholder: "Explore",
    title: "Temukan Produk\nKeren, Harga Hemat",
    subtitle:
      "Temukan produk preloved, thrift, dan produk unik yang cocok buat gaya kamu",
    cta: "Mulai Explore",
    ctaHref: "#rekomendasi",
  },
  {
    id: 2,
    type: "sell",
    searchPlaceholder: "Seller",
    title: "Jual Cepat,\nUntung Dekat",
    subtitle:
      "Pasang produk gratis, jangkau banyak pembeli, mulai hasilkan uang hari ini",
    cta: "Mulai Jualan",
    ctaHref: "/store-panel/settings",
  },
  {
    id: 3,
    type: "payment",
    searchPlaceholder: "Pembayaran",
    title: "Chat, langsung bayar",
    subtitle: "Transfer manual ke rekening/VA atau COD.",
    cta: "Pelajari Lebih Lanjut",
    ctaHref: "/cara-bayar",
  },
];

// ─── Theme per type ───────────────────────────────────────────
const themes = {
  explore: {
    bg: "from-[#e07b00] via-[#f5920a] to-[#f5a623]",
    bgSolid: "#e07b00",
    ctaTextColor: "text-[#b85c00]",
    searchBorder: "border-white/40",
    searchText: "text-white/80",
  },
  sell: {
    bg: "from-[#006b6b] via-[#008080] to-[#00a0a0]",
    bgSolid: "#007070",
    ctaTextColor: "text-[#005555]",
    searchBorder: "border-white/30",
    searchText: "text-white/70",
  },
  payment: {
    bg: "from-[#5b0fa8] via-[#7b22cc] to-[#9b3de0]",
    bgSolid: "#6a18b8",
    ctaTextColor: "text-[#5b0fa8]",
    searchBorder: "border-white/30",
    searchText: "text-white/70",
  },
};

// ─── Illustration: Explore (Orange) ───────────────────────────
function IllustrationExplore() {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Podium */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "75%",
          height: "22%",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,220,120,0.55) 0%, rgba(200,140,30,0.3) 100%)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      />

      {/* Shopping Bag */}
      <div
        className="absolute"
        style={{ bottom: "18%", left: "30%", width: "30%", aspectRatio: "3/4" }}
      >
        {/* Handles */}
        <svg
          viewBox="0 0 60 20"
          className="w-full"
          style={{ marginBottom: -2 }}
        >
          <path
            d="M15 18 Q15 4 30 4 Q45 4 45 18"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {/* Bag body */}
        <div
          style={{
            background:
              "linear-gradient(160deg, rgba(255,210,100,0.55) 0%, rgba(230,150,20,0.45) 100%)",
            border: "1.5px solid rgba(255,255,255,0.5)",
            borderRadius: 8,
            width: "100%",
            aspectRatio: "3/4",
          }}
        />
      </div>

      {/* Outfit / Sweater */}
      <div
        className="absolute flex flex-col items-center"
        style={{ bottom: "17%", right: "6%", width: "36%" }}
      >
        {/* Sunglasses */}
        <svg viewBox="0 0 60 20" className="w-4/5 mb-1">
          <rect
            x="4"
            y="5"
            width="22"
            height="12"
            rx="5"
            fill="rgba(80,40,0,0.7)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          />
          <rect
            x="34"
            y="5"
            width="22"
            height="12"
            rx="5"
            fill="rgba(80,40,0,0.7)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          />
          <line
            x1="26"
            y1="11"
            x2="34"
            y2="11"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
        </svg>
        {/* Sweater body */}
        <svg viewBox="0 0 70 80" className="w-full">
          <path
            d="M10 20 L5 10 L18 5 Q25 0 35 0 Q45 0 52 5 L65 10 L60 20 L50 14 L50 80 L20 80 L20 14 Z"
            fill="rgba(200,100,0,0.55)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          {/* Collar */}
          <path
            d="M25 0 Q35 8 45 0"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
          {/* Sleeve left */}
          <path
            d="M5 10 L0 32 L12 34 L18 12"
            fill="rgba(180,80,0,0.5)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          {/* Sleeve right */}
          <path
            d="M65 10 L70 32 L58 34 L52 12"
            fill="rgba(180,80,0,0.5)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          {/* Rib bottom */}
          {[0, 5, 10, 15, 20].map((x) => (
            <line
              key={x}
              x1={20 + x}
              y1="73"
              x2={20 + x}
              y2="80"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
        {/* Pants */}
        <svg viewBox="0 0 70 50" className="w-full" style={{ marginTop: -4 }}>
          <rect
            x="0"
            y="0"
            width="70"
            height="50"
            rx="4"
            fill="rgba(190,90,0,0.5)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          <line
            x1="35"
            y1="0"
            x2="35"
            y2="50"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Sneakers */}
      <div
        className="absolute flex gap-1"
        style={{ bottom: "17%", right: "7%", width: "34%" }}
      >
        <svg viewBox="0 0 100 38" className="w-full">
          {/* Left shoe */}
          <path
            d="M4 28 Q4 14 18 12 Q28 10 38 14 L42 18 Q36 20 24 22 Q12 24 4 28 Z"
            fill="rgba(255,255,255,0.8)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
          <path
            d="M4 28 Q12 36 38 34 L42 28 Q28 30 4 28 Z"
            fill="rgba(220,220,220,0.7)"
          />
          <line
            x1="18"
            y1="18"
            x2="20"
            y2="13"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
          <line
            x1="24"
            y1="16"
            x2="26"
            y2="12"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
          <line
            x1="30"
            y1="15"
            x2="32"
            y2="12"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
          {/* Right shoe */}
          <path
            d="M58 28 Q58 14 72 12 Q82 10 92 14 L96 18 Q90 20 78 22 Q66 24 58 28 Z"
            fill="rgba(255,255,255,0.8)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
          />
          <path
            d="M58 28 Q66 36 92 34 L96 28 Q82 30 58 28 Z"
            fill="rgba(220,220,220,0.7)"
          />
          <line
            x1="72"
            y1="18"
            x2="74"
            y2="13"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
          <line
            x1="78"
            y1="16"
            x2="80"
            y2="12"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
          <line
            x1="84"
            y1="15"
            x2="86"
            y2="12"
            stroke="rgba(200,100,20,0.7)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Mini camera */}
      <div
        className="absolute"
        style={{ bottom: "14%", right: "5%", width: "15%", opacity: 0.85 }}
      >
        <svg viewBox="0 0 40 34" className="w-full">
          <rect
            x="2"
            y="8"
            width="36"
            height="24"
            rx="4"
            fill="rgba(200,100,10,0.7)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="20" r="4" fill="rgba(255,255,255,0.25)" />
          <rect
            x="12"
            y="2"
            width="10"
            height="7"
            rx="2"
            fill="rgba(200,100,10,0.6)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Sparkles */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 280"
      >
        {/* Big sparkle top-right */}
        <path
          d="M340 40 L343 52 L356 55 L343 58 L340 70 L337 58 L324 55 L337 52 Z"
          fill="rgba(255,255,255,0.85)"
        />
        {/* Small sparkle mid-right */}
        <path
          d="M370 110 L372 118 L380 120 L372 122 L370 130 L368 122 L360 120 L368 118 Z"
          fill="rgba(255,255,255,0.55)"
        />
        {/* Tiny top-right dots */}
        {[
          [345, 80],
          [360, 95],
          [375, 75],
          [385, 100],
          [360, 115],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="2.5"
            fill="rgba(255,255,255,0.4)"
          />
        ))}
        {/* Diamond mid */}
        <path
          d="M310 145 L314 152 L310 159 L306 152 Z"
          fill="rgba(255,255,255,0.55)"
        />
        <circle cx="30" cy="70" r="4" fill="rgba(255,255,255,0.25)" />
        <circle cx="18" cy="200" r="3" fill="rgba(255,255,255,0.2)" />
      </svg>
    </div>
  );
}

// ─── Illustration: Sell (Teal/Green) ──────────────────────────
function IllustrationSell() {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Wave/hill at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 Q100 40 200 60 Q300 80 400 50 L400 120 L0 120 Z"
          fill="rgba(0,160,160,0.3)"
        />
        <path
          d="M0 100 Q100 70 200 85 Q300 100 400 80 L400 120 L0 120 Z"
          fill="rgba(0,130,130,0.25)"
        />
      </svg>

      {/* Open box */}
      <div
        className="absolute"
        style={{ bottom: "12%", left: "8%", width: "40%" }}
      >
        <svg viewBox="0 0 120 100" className="w-full">
          {/* Box front */}
          <path
            d="M10 50 L10 95 L110 95 L110 50 Z"
            fill="rgba(0,180,180,0.35)"
            stroke="rgba(0,220,220,0.6)"
            strokeWidth="2"
          />
          {/* Box left flap */}
          <path
            d="M10 50 L10 25 L55 30 L55 50 Z"
            fill="rgba(0,200,200,0.3)"
            stroke="rgba(0,220,220,0.5)"
            strokeWidth="1.5"
          />
          {/* Box right flap */}
          <path
            d="M110 50 L110 25 L65 30 L65 50 Z"
            fill="rgba(0,200,200,0.25)"
            stroke="rgba(0,220,220,0.5)"
            strokeWidth="1.5"
          />
          {/* Crease line */}
          <line
            x1="60"
            y1="30"
            x2="60"
            y2="50"
            stroke="rgba(0,220,220,0.4)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        </svg>
      </div>

      {/* Phone with store awning */}
      <div
        className="absolute"
        style={{ bottom: "15%", right: "5%", width: "42%" }}
      >
        <svg viewBox="0 0 120 180" className="w-full">
          {/* Phone body */}
          <rect
            x="20"
            y="0"
            width="80"
            height="160"
            rx="12"
            fill="rgba(0,180,200,0.45)"
            stroke="rgba(0,230,230,0.65)"
            strokeWidth="2.5"
          />
          {/* Screen */}
          <rect
            x="28"
            y="12"
            width="64"
            height="126"
            rx="8"
            fill="rgba(0,200,210,0.3)"
          />
          {/* Awning stripes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${28 + i * 12} 12 L${28 + i * 12 + 10} 12`}
              stroke={
                i % 2 === 0 ? "rgba(255,255,255,0.7)" : "rgba(0,180,200,0.4)"
              }
              strokeWidth="12"
              strokeLinecap="butt"
            />
          ))}
          {/* Awning arc */}
          <path
            d="M28 30 Q60 42 92 30"
            fill="rgba(0,180,200,0.5)"
            stroke="rgba(0,230,230,0.6)"
            strokeWidth="2"
          />
          {/* QR code placeholder */}
          <rect
            x="40"
            y="75"
            width="40"
            height="40"
            rx="4"
            fill="rgba(0,200,220,0.4)"
            stroke="rgba(0,230,230,0.5)"
            strokeWidth="1.5"
          />
          <rect
            x="46"
            y="81"
            width="10"
            height="10"
            rx="1"
            fill="rgba(0,230,230,0.6)"
          />
          <rect
            x="64"
            y="81"
            width="10"
            height="10"
            rx="1"
            fill="rgba(0,230,230,0.6)"
          />
          <rect
            x="46"
            y="99"
            width="10"
            height="10"
            rx="1"
            fill="rgba(0,230,230,0.6)"
          />
          <rect
            x="58"
            y="93"
            width="4"
            height="4"
            rx="1"
            fill="rgba(0,230,230,0.5)"
          />
          <rect
            x="66"
            y="93"
            width="8"
            height="4"
            rx="1"
            fill="rgba(0,230,230,0.5)"
          />
          <rect
            x="64"
            y="99"
            width="4"
            height="10"
            rx="1"
            fill="rgba(0,230,230,0.5)"
          />
          <rect
            x="70"
            y="99"
            width="4"
            height="5"
            rx="1"
            fill="rgba(0,230,230,0.5)"
          />
          {/* Home bar */}
          <rect
            x="46"
            y="148"
            width="28"
            height="4"
            rx="2"
            fill="rgba(255,255,255,0.35)"
          />
        </svg>
      </div>

      {/* Dollar speech bubble */}
      <div
        className="absolute"
        style={{ top: "5%", right: "6%", width: "28%" }}
      >
        <svg viewBox="0 0 80 70" className="w-full">
          <rect
            x="0"
            y="0"
            width="70"
            height="52"
            rx="10"
            fill="rgba(0,200,210,0.5)"
            stroke="rgba(0,230,230,0.7)"
            strokeWidth="2"
          />
          <path
            d="M14 52 L10 68 L28 52 Z"
            fill="rgba(0,200,210,0.5)"
            stroke="rgba(0,230,230,0.5)"
            strokeWidth="1"
          />
          <text
            x="35"
            y="34"
            textAnchor="middle"
            fontSize="26"
            fontWeight="bold"
            fill="rgba(255,255,255,0.9)"
          >
            $
          </text>
        </svg>
      </div>

      {/* Floating coins */}
      {[
        { cx: "72%", cy: "30%", r: 9, opacity: 0.7 },
        { cx: "82%", cy: "50%", r: 7, opacity: 0.55 },
        { cx: "88%", cy: "22%", r: 5, opacity: 0.45 },
        { cx: "12%", cy: "22%", r: 6, opacity: 0.4 },
        { cx: "5%", cy: "38%", r: 4, opacity: 0.35 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: c.cx,
            top: c.cy,
            width: c.r * 2,
            height: c.r * 2,
            background: `rgba(255,200,50,${c.opacity})`,
            border: "1px solid rgba(255,230,100,0.6)",
          }}
        />
      ))}

      {/* Sparkles */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 280"
      >
        <circle cx="30" cy="240" r="4" fill="rgba(0,230,230,0.3)" />
        <circle cx="380" cy="200" r="3" fill="rgba(0,230,230,0.25)" />
        <path
          d="M35 35 L37 43 L45 45 L37 47 L35 55 L33 47 L25 45 L33 43 Z"
          fill="rgba(255,255,255,0.35)"
        />
        {/* dot grid bottom-left */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={18 + col * 10}
              cy={220 + row * 10}
              r="1.5"
              fill="rgba(0,230,230,0.25)"
            />
          )),
        )}
      </svg>
    </div>
  );
}

// ─── Illustration: Payment (Purple) ───────────────────────────
function IllustrationPayment() {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Podium */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "70%",
          height: "20%",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(180,100,240,0.5) 0%, rgba(120,40,180,0.3) 100%)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      />

      {/* Phone with shield */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "36%",
        }}
      >
        <svg viewBox="0 0 100 170" className="w-full">
          {/* Phone body */}
          <rect
            x="8"
            y="0"
            width="84"
            height="160"
            rx="14"
            fill="rgba(180,80,230,0.5)"
            stroke="rgba(210,120,255,0.7)"
            strokeWidth="2.5"
          />
          {/* Screen gradient */}
          <defs>
            <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(220,80,200,0.8)" />
              <stop offset="100%" stopColor="rgba(140,40,220,0.8)" />
            </linearGradient>
          </defs>
          <rect
            x="16"
            y="12"
            width="68"
            height="130"
            rx="8"
            fill="url(#phoneGrad)"
          />
          {/* Camera notch */}
          <rect
            x="36"
            y="5"
            width="28"
            height="6"
            rx="3"
            fill="rgba(0,0,0,0.35)"
          />
          {/* Shield icon */}
          <path
            d="M50 35 L36 42 L36 60 Q36 74 50 80 Q64 74 64 60 L64 42 Z"
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
          />
          <path
            d="M44 57 L48 62 L57 52"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Home bar */}
          <rect
            x="34"
            y="148"
            width="32"
            height="4"
            rx="2"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
      </div>

      {/* Transfer Manual badge - top */}
      <div
        className="absolute"
        style={{ top: "4%", right: "4%", width: "40%" }}
      >
        <svg viewBox="0 0 120 50" className="w-full">
          <rect
            x="0"
            y="0"
            width="120"
            height="50"
            rx="10"
            fill="rgba(100,40,180,0.65)"
            stroke="rgba(180,120,255,0.6)"
            strokeWidth="1.5"
          />
          {/* Icon */}
          <rect
            x="8"
            y="10"
            width="28"
            height="28"
            rx="5"
            fill="rgba(255,255,255,0.15)"
          />
          <circle
            cx="22"
            cy="24"
            r="7"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
          <line
            x1="22"
            y1="19"
            x2="22"
            y2="29"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <line
            x1="17"
            y1="24"
            x2="27"
            y2="24"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          {/* Text */}
          <text
            x="44"
            y="20"
            fontSize="9"
            fontWeight="bold"
            fill="rgba(255,255,255,0.95)"
            fontFamily="sans-serif"
          >
            TRANSFER
          </text>
          <text
            x="44"
            y="32"
            fontSize="9"
            fontWeight="bold"
            fill="rgba(255,255,255,0.95)"
            fontFamily="sans-serif"
          >
            MANUAL
          </text>
        </svg>
      </div>

      {/* Virtual Account badge - bottom left */}
      <div
        className="absolute"
        style={{ bottom: "25%", left: "2%", width: "40%" }}
      >
        <svg viewBox="0 0 120 50" className="w-full">
          <rect
            x="0"
            y="0"
            width="120"
            height="50"
            rx="10"
            fill="rgba(100,40,180,0.65)"
            stroke="rgba(180,120,255,0.6)"
            strokeWidth="1.5"
          />
          <rect
            x="8"
            y="10"
            width="28"
            height="28"
            rx="5"
            fill="rgba(255,255,255,0.15)"
          />
          <circle
            cx="22"
            cy="24"
            r="7"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
            fill="none"
          />
          <line
            x1="22"
            y1="19"
            x2="22"
            y2="29"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <line
            x1="17"
            y1="24"
            x2="27"
            y2="24"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.5"
          />
          <text
            x="44"
            y="20"
            fontSize="9"
            fontWeight="bold"
            fill="rgba(255,255,255,0.95)"
            fontFamily="sans-serif"
          >
            VIRTUAL
          </text>
          <text
            x="44"
            y="32"
            fontSize="9"
            fontWeight="bold"
            fill="rgba(255,255,255,0.95)"
            fontFamily="sans-serif"
          >
            ACCOUNT
          </text>
        </svg>
      </div>

      {/* COD badge - right */}
      <div
        className="absolute"
        style={{ top: "30%", right: "2%", width: "22%" }}
      >
        <svg viewBox="0 0 70 70" className="w-full">
          <rect
            x="0"
            y="0"
            width="70"
            height="70"
            rx="12"
            fill="rgba(160,140,220,0.5)"
            stroke="rgba(200,180,255,0.6)"
            strokeWidth="1.5"
          />
          <text
            x="35"
            y="46"
            textAnchor="middle"
            fontSize="22"
            fontWeight="bold"
            fill="rgba(80,40,160,0.95)"
            fontFamily="sans-serif"
          >
            COD
          </text>
        </svg>
      </div>

      {/* Connector lines from phone to badges */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 280"
      >
        {/* Phone center approx at 200, 140 */}
        {/* Line to Transfer Manual (top-right) */}
        <line
          x1="235"
          y1="100"
          x2="280"
          y2="50"
          stroke="rgba(200,160,255,0.5)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        {/* Line to Virtual Account (left) */}
        <line
          x1="165"
          y1="160"
          x2="110"
          y2="175"
          stroke="rgba(200,160,255,0.5)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        {/* Line to COD (right) */}
        <line
          x1="235"
          y1="140"
          x2="310"
          y2="140"
          stroke="rgba(200,160,255,0.5)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {/* Coins stack */}
        <ellipse
          cx="310"
          cy="220"
          rx="18"
          ry="5"
          fill="rgba(220,160,40,0.45)"
          stroke="rgba(240,200,80,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="310"
          cy="213"
          rx="18"
          ry="5"
          fill="rgba(220,160,40,0.5)"
          stroke="rgba(240,200,80,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="310"
          cy="206"
          rx="18"
          ry="5"
          fill="rgba(220,160,40,0.55)"
          stroke="rgba(240,200,80,0.55)"
          strokeWidth="1"
        />
        <ellipse
          cx="310"
          cy="199"
          rx="18"
          ry="5"
          fill="rgba(220,160,40,0.6)"
          stroke="rgba(240,200,80,0.6)"
          strokeWidth="1"
        />

        {/* Package box */}
        <rect
          x="165"
          y="205"
          width="45"
          height="35"
          rx="5"
          fill="rgba(180,120,60,0.55)"
          stroke="rgba(220,160,80,0.5)"
          strokeWidth="1.5"
        />
        <path
          d="M165 215 L187 215 L187 205"
          stroke="rgba(220,160,80,0.5)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M188 205 L210 205 L210 215 L188 215"
          stroke="rgba(220,160,80,0.4)"
          strokeWidth="1"
          fill="none"
        />
        <line
          x1="187"
          y1="205"
          x2="188"
          y2="205"
          stroke="rgba(255,220,120,0.5)"
          strokeWidth="2"
        />

        {/* dot pattern top-left */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <circle
              key={`${row}-${col}`}
              cx={12 + col * 10}
              cy={20 + row * 10}
              r="1.5"
              fill="rgba(200,160,255,0.3)"
            />
          )),
        )}

        {/* dot pattern top-right */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <circle
              key={`r${row}-${col}`}
              cx={360 + col * 8}
              cy={10 + row * 8}
              r="1.5"
              fill="rgba(200,160,255,0.25)"
            />
          )),
        )}
      </svg>
    </div>
  );
}

// ─── Single Slide Card ────────────────────────────────────────
interface SliderCardProps {
  data: SliderCardData;
  isActive: boolean;
  isAnimating: boolean;
}

export function SliderCard({ data, isActive, isAnimating }: SliderCardProps) {
  const router = useRouter();
  const theme = themes[data.type];

  const handleCta = () => {
    if (data.ctaAction) {
      data.ctaAction();
      return;
    }
    if (data.ctaHref) {
      if (data.ctaHref.startsWith("#")) {
        const el = document.getElementById(data.ctaHref.slice(1));
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(data.ctaHref);
      }
    }
  };

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        isActive && !isAnimating
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.bg}`} />

      {/* Noise/grain overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-stretch">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-5 py-5 md:px-10 md:py-8 flex-1 min-w-0 max-w-[55%] md:max-w-[50%] z-10">
          {/* Search bar pill */}
          <div
            className={`inline-flex items-center gap-2 rounded-full border ${theme.searchBorder} bg-white/10 backdrop-blur-sm px-3 py-1.5 mb-3 md:mb-4 w-fit`}
          >
            <span className={`text-xs md:text-sm ${theme.searchText}`}>
              {data.searchPlaceholder}
            </span>
            <svg
              className="h-3.5 w-3.5 text-white/60 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4-4" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-white font-extrabold leading-tight whitespace-pre-line mb-2 md:mb-3 text-[clamp(1.1rem,3.5vw,2.2rem)]">
            {data.title}
          </h2>

          {/* Payment slide has extra bold subtitle */}
          {data.type === "payment" && (
            <p className="text-white font-bold text-sm md:text-base mb-1">
              Pilih cara pembayaran nyaman.
            </p>
          )}

          {/* Subtitle */}
          <p className="text-white/80 text-[11px] md:text-sm leading-relaxed mb-4 md:mb-5 max-w-[220px] md:max-w-xs">
            {data.subtitle}
          </p>

          {/* CTA button */}
          <button
            onClick={handleCta}
            className={`inline-flex items-center gap-2.5 rounded-full bg-white px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold ${theme.ctaTextColor} shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-150 w-fit`}
          >
            {data.type === "explore" && (
              <svg
                className="h-3.5 w-3.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            )}
            {data.cta}
          </button>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 relative overflow-hidden">
          {data.type === "explore" && <IllustrationExplore />}
          {data.type === "sell" && <IllustrationSell />}
          {data.type === "payment" && <IllustrationPayment />}
        </div>
      </div>
    </div>
  );
}

// ─── Banner Slider (main exported component) ──────────────────
export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);

  const total = sliderData.length;

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 200);
  };

  const next = () => goTo((current + 1) % total);
  const prev = () => goTo((current - 1 + total) % total);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-sm select-none"
      style={{ aspectRatio: "16/5", minHeight: 140, maxHeight: 320 }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
      }}
    >
      {sliderData.map((slide, i) => (
        <SliderCard
          key={slide.id}
          data={slide}
          isActive={i === current}
          isAnimating={animating}
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {sliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
