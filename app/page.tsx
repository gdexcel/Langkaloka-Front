"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import { useStores } from "@/hooks/useStores";
import ProductCard from "@/components/products/ProductCard";
import StoreCard from "@/components/store/StoreCard";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Banner Info ──────────────────────────────────────────────
const banners = [
  {
    id: 1,
    type: "explore",
    tag: "Cari Favoritmu",
    title: "Barang Keren,\nHarga Hemat",
    subtitle:
      "Temukan preloved, thrift, dan produk unik yang cocok buat gaya kamu.",
    cta: "Mulai Cari",
    bg: "from-yellow-600 via-amber-500 to-orange-500",
  },
  {
    id: 2,
    type: "sell",
    tag: "Jual Gratis",
    title: "Jual Cepat,\nUntung Dekat",
    subtitle:
      "Pasang produk gratis, jangkau banyak pembeli, dan mulai hasilkan uang hari ini.",
    cta: "Mulai Jual",
    bg: "from-emerald-500 via-teal-500 to-cyan-600",
  },
];

// ─── SVG Ilustrasi Banner Explore ────────────────────────────
function IllustrationExplore() {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* === BACK ROW === */}
      {/* Shirt (back left) */}
      <rect
        x="38"
        y="98"
        width="68"
        height="82"
        rx="8"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
      <path
        d="M38 116 L50 106 L60 114 L72 106 L84 114 L72 106 L72 98"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M60 98 Q60 110 72 106"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="52"
        y1="134"
        x2="98"
        y2="134"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="52"
        y1="142"
        x2="90"
        y2="142"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Bag (back right) */}
      <rect
        x="214"
        y="88"
        width="68"
        height="92"
        rx="8"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
      <path
        d="M230 88 C230 70 266 70 266 88"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="232"
        y="108"
        width="28"
        height="18"
        rx="4"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
      />
      <circle cx="246" cy="117" r="3" fill="rgba(255,255,255,0.55)" />

      {/* === MIDDLE ROW === */}
      {/* Sneaker (center left) */}
      <rect
        x="66"
        y="82"
        width="88"
        height="66"
        rx="10"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.8"
      />
      <path
        d="M78 130 Q82 118 102 114 Q116 112 140 118 L142 126 Q120 124 104 128 Q88 132 78 130 Z"
        fill="rgba(255,255,255,0.35)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
      <path
        d="M78 130 Q80 136 96 136 Q120 136 142 130"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="94"
        y1="118"
        x2="100"
        y2="112"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="104"
        y1="116"
        x2="110"
        y2="112"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="114"
        y1="115"
        x2="118"
        y2="112"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M84 118 Q90 106 102 108"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Watch (center right) */}
      <rect
        x="166"
        y="76"
        width="88"
        height="72"
        rx="10"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.8"
      />
      <circle
        cx="210"
        cy="112"
        r="22"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
      />
      <rect
        x="204"
        y="76"
        width="12"
        height="16"
        rx="3"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      <rect
        x="204"
        y="134"
        width="12"
        height="14"
        rx="3"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      <line
        x1="210"
        y1="112"
        x2="210"
        y2="96"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="210"
        y1="112"
        x2="222"
        y2="112"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="210"
        y1="92"
        x2="210"
        y2="95"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <line
        x1="210"
        y1="129"
        x2="210"
        y2="132"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <line
        x1="190"
        y1="112"
        x2="193"
        y2="112"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <line
        x1="227"
        y1="112"
        x2="230"
        y2="112"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />

      {/* === FRONT CENTER — Phone === */}
      <rect
        x="118"
        y="54"
        width="84"
        height="142"
        rx="14"
        fill="rgba(255,255,255,0.24)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.2"
      />
      <rect
        x="126"
        y="68"
        width="68"
        height="110"
        rx="8"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <rect
        x="146"
        y="60"
        width="28"
        height="7"
        rx="3.5"
        fill="rgba(255,255,255,0.35)"
      />
      {/* Screen content — product grid thumbnails */}
      <rect
        x="130"
        y="74"
        width="28"
        height="28"
        rx="4"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <rect
        x="162"
        y="74"
        width="28"
        height="28"
        rx="4"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <rect
        x="130"
        y="106"
        width="28"
        height="28"
        rx="4"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <rect
        x="162"
        y="106"
        width="28"
        height="28"
        rx="4"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <circle cx="144" cy="88" r="6" fill="rgba(255,255,255,0.4)" />
      <path
        d="M168 84 Q176 80 184 88 Q176 96 168 92 Z"
        fill="rgba(255,255,255,0.4)"
      />
      <rect
        x="135"
        y="114"
        width="18"
        height="12"
        rx="2"
        fill="rgba(255,255,255,0.38)"
      />
      <path
        d="M168 116 L178 110 L188 116 L188 128 L168 128 Z"
        fill="rgba(255,255,255,0.36)"
      />
      {/* Bottom search bar */}
      <rect
        x="130"
        y="140"
        width="60"
        height="12"
        rx="6"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <circle cx="138" cy="146" r="3" fill="rgba(255,255,255,0.45)" />
      <line
        x1="144"
        y1="146"
        x2="184"
        y2="146"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Home indicator */}
      <rect
        x="148"
        y="166"
        width="24"
        height="4"
        rx="2"
        fill="rgba(255,255,255,0.35)"
      />

      {/* === Price tag floating === */}
      <rect
        x="248"
        y="48"
        width="46"
        height="26"
        rx="6"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
      />
      <circle
        cx="247"
        cy="61"
        r="3"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.2"
      />
      <line
        x1="256"
        y1="56"
        x2="286"
        y2="56"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="256"
        y1="63"
        x2="278"
        y2="63"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* === Sparkles === */}
      <path
        d="M284 22 L286.8 32 L298 35 L286.8 38 L284 48 L281.2 38 L270 35 L281.2 32 Z"
        fill="rgba(255,255,255,0.78)"
      />
      <path
        d="M30 52 L32 58.5 L39 60.5 L32 62.5 L30 69 L28 62.5 L21 60.5 L28 58.5 Z"
        fill="rgba(255,255,255,0.58)"
      />
      <path
        d="M300 90 L301.8 95.8 L308 97.5 L301.8 99.2 L300 105 L298.2 99.2 L292 97.5 L298.2 95.8 Z"
        fill="rgba(255,255,255,0.48)"
      />
      <circle cx="26" cy="108" r="3.5" fill="rgba(255,255,255,0.32)" />
      <circle cx="302" cy="155" r="3" fill="rgba(255,255,255,0.25)" />
      <circle cx="58" cy="64" r="2.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

// ─── SVG Ilustrasi Banner Sell ────────────────────────────────
function IllustrationSell() {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* === SHADOW === */}
      <ellipse cx="160" cy="196" rx="82" ry="10" fill="rgba(0,0,0,0.08)" />

      {/* === MAIN BOX BODY (front face) === */}
      <rect
        x="72"
        y="104"
        width="136"
        height="88"
        rx="6"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.2"
      />
      <line
        x1="72"
        y1="128"
        x2="208"
        y2="128"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
      <line
        x1="72"
        y1="152"
        x2="208"
        y2="152"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />

      {/* === TOP FACE (isometric top) === */}
      <path
        d="M72 104 L116 80 L252 80 L208 104 Z"
        fill="rgba(255,255,255,0.3)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.2"
      />

      {/* === RIGHT FACE (side) === */}
      <path
        d="M208 104 L252 80 L252 168 L208 192 Z"
        fill="rgba(255,255,255,0.16)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2.2"
      />

      {/* === BOX FLAPS on top === */}
      <path
        d="M72 104 L116 80 L140 92 L96 116 Z"
        fill="rgba(255,255,255,0.12)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.5"
      />
      <path
        d="M140 92 L184 68 L252 80 L208 104 Z"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="92"
        x2="140"
        y2="104"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* === TAPE strip on top === */}
      <path
        d="M118 96 L162 72 L162 84 L118 108 Z"
        fill="rgba(255,255,255,0.3)"
      />

      {/* === SHIPPING LABEL on front face === */}
      <rect
        x="88"
        y="118"
        width="76"
        height="52"
        rx="5"
        fill="rgba(255,255,255,0.3)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <line
        x1="96"
        y1="128"
        x2="156"
        y2="128"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="96"
        y1="136"
        x2="148"
        y2="136"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="96"
        y1="143"
        x2="140"
        y2="143"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Barcode */}
      {[
        [96, 1.5],
        [100, 2.5],
        [104, 1],
        [107, 2],
        [110, 1.5],
        [113, 1],
        [116, 2],
        [120, 1],
        [123, 1.5],
        [126, 2.5],
        [130, 1],
        [133, 1.5],
        [136, 2],
      ].map(([x, w], i) => (
        <line
          key={i}
          x1={x}
          y1="152"
          x2={x}
          y2="162"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={w}
        />
      ))}

      {/* === FRAGILE icon on side face === */}
      <path
        d="M226 110 Q236 100 246 110 Q236 120 226 110 Z"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
      />
      <path
        d="M232 104 L236 116 L240 106"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="218"
        y1="126"
        x2="250"
        y2="126"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="222"
        y1="131"
        x2="248"
        y2="131"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* === THIS SIDE UP arrow on side === */}
      <path
        d="M234 148 L240 138 L246 148"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="240"
        y1="138"
        x2="240"
        y2="158"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* === Small box behind-left === */}
      <rect
        x="38"
        y="138"
        width="52"
        height="44"
        rx="5"
        fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.5"
      />
      <path
        d="M38 138 L58 126 L90 126 L90 138"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="1.5"
      />
      <line
        x1="64"
        y1="126"
        x2="64"
        y2="138"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      <rect
        x="53"
        y="130"
        width="22"
        height="8"
        rx="1"
        fill="rgba(255,255,255,0.25)"
      />

      {/* === Floating envelope / invoice === */}
      <rect
        x="24"
        y="74"
        width="48"
        height="34"
        rx="5"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.5"
      />
      <path
        d="M24 80 L48 98 L72 80"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* === Money / coins floating === */}
      <circle
        cx="272"
        cy="56"
        r="14"
        fill="rgba(255,255,255,0.2)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.8"
      />
      <circle
        cx="272"
        cy="56"
        r="9"
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <line
        x1="268"
        y1="56"
        x2="276"
        y2="56"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="272"
        y1="52"
        x2="272"
        y2="60"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse
        cx="272"
        cy="70"
        rx="14"
        ry="4"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />

      {/* === Sparkles === */}
      <path
        d="M284 22 L287 32 L298 35 L287 38 L284 48 L281 38 L270 35 L281 32 Z"
        fill="rgba(255,255,255,0.78)"
      />
      <path
        d="M30 44 L32 50.5 L39 52.5 L32 54.5 L30 61 L28 54.5 L21 52.5 L28 50.5 Z"
        fill="rgba(255,255,255,0.58)"
      />
      <path
        d="M302 104 L303.8 110 L310 112 L303.8 114 L302 120 L300.2 114 L294 112 L300.2 110 Z"
        fill="rgba(255,255,255,0.45)"
      />
      <circle cx="22" cy="114" r="3.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="308" cy="162" r="3" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}

export { IllustrationExplore, IllustrationSell };

// ─── Banner Slider ────────────────────────────────────────────
function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const router = useRouter();

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 180);
  };
  const next = () => goTo((current + 1) % banners.length);
  const prev = () => goTo((current - 1 + banners.length) % banners.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current]);

  const b = banners[current];

  const handleCta = () => {
    if (b.type === "explore") {
      document
        .getElementById("rekomendasi")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/store-panel/settings");
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-sm select-none"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
      }}
    >
      <div
        className={`bg-gradient-to-r ${b.bg} transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex items-center justify-between px-5 py-6 md:px-10 md:py-10 gap-4">
          {/* Text */}
          <div className="flex-1 text-white min-w-0">
            {/* Tag pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold mb-3 backdrop-blur-sm">
              {b.type === "explore" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 22V12h6v10"
                  />
                </svg>
              )}
              {b.tag}
            </span>

            <h2 className="text-xl md:text-3xl font-bold leading-tight mb-2 whitespace-pre-line">
              {b.title}
            </h2>
            <p className="text-white/80 text-xs md:text-sm max-w-xs mb-4 leading-relaxed">
              {b.subtitle}
            </p>

            <button
              onClick={handleCta}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs md:text-sm font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition shadow-md"
            >
              {b.type === "explore" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-amber-500"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              )}
              {b.cta}
            </button>
          </div>

          {/* Ilustrasi SVG */}
          <div className="shrink-0 h-24 w-24 md:h-32 md:w-32">
            {b.type === "explore" ? (
              <IllustrationExplore />
            ) : (
              <IllustrationSell />
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Gender Buttons ──────────────────────────────────────────
function GenderButtons() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => router.push("/product/all/women")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        {/* SVG Female illustration */}
        <svg
          className="absolute -right-2 -bottom-2 h-16 w-16 md:h-20 md:w-20 opacity-20 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="32"
            cy="22"
            r="14"
            stroke="white"
            strokeWidth="5"
            fill="none"
          />
          <line
            x1="32"
            y1="36"
            x2="32"
            y2="56"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="22"
            y1="48"
            x2="42"
            y2="48"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Gender
        </p>
        <h3 className="text-base md:text-xl font-bold">Wanita</h3>
        <p className="text-[11px] md:text-sm opacity-70 mt-0.5 hidden sm:block">
          Koleksi fashion wanita
        </p>
        <span className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
          Lihat <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </span>
      </button>

      <button
        onClick={() => router.push("/product/all/men")}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 md:p-6 text-white shadow-sm active:scale-[0.97] transition-transform duration-150 text-left"
      >
        {/* SVG Male illustration */}
        <svg
          className="absolute right-1 -bottom-2 h-16 w-16 md:h-20 md:w-20 opacity-20 pointer-events-none"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="26"
            cy="38"
            r="14"
            stroke="white"
            strokeWidth="5"
            fill="none"
          />
          <line
            x1="36"
            y1="28"
            x2="54"
            y2="10"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="42"
            y1="10"
            x2="54"
            y2="10"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="54"
            y1="10"
            x2="54"
            y2="22"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest opacity-75 mb-0.5">
          Gender
        </p>
        <h3 className="text-base md:text-xl font-bold">Pria</h3>
        <p className="text-[11px] md:text-sm opacity-70 mt-0.5 hidden sm:block">
          Koleksi fashion pria
        </p>
        <span className="inline-flex items-center gap-1 mt-2 md:mt-3 text-[10px] md:text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
          Lihat <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
        </span>
      </button>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-100 aspect-square" />
      <div className="p-2 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonStoreCard() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse p-3 w-full">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="h-2.5 bg-gray-200 rounded w-12" />
      <div className="h-2.5 bg-gray-200 rounded w-8" />
    </div>
  );
}

// ─── Store Slider ─────────────────────────────────────────────
function StoreSlider({
  stores,
  isLoading,
}: {
  stores: any[];
  isLoading: boolean;
}) {
  const router = useRouter();
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 3 : 5);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => setPage(0), [cols]);

  const totalPages = Math.ceil(stores.length / cols);
  const visibleStores = stores.slice(page * cols, page * cols + cols);
  const gridColsClass = cols === 3 ? "grid-cols-3" : "grid-cols-5";

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          🏪 Rekomendasi Toko
        </h2>
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="cursor-pointer h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="cursor-pointer h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <>
          <div className={`hidden sm:grid ${gridColsClass} gap-2`}>
            {Array.from({ length: cols }).map((_, i) => (
              <SkeletonStoreCard key={i} />
            ))}
          </div>
          <div className="flex sm:hidden gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[calc(33.33%-8px)]">
                <SkeletonStoreCard />
              </div>
            ))}
          </div>
        </>
      ) : stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 w-full gap-2">
          <p className="text-xs text-gray-400">Belum ada toko terdaftar</p>
        </div>
      ) : (
        <>
          <div
            className={`hidden sm:grid ${gridColsClass} grid-rows-1 overflow-hidden gap-2`}
          >
            {visibleStores.map((store: any) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => router.push(`/store/${store.id}`)}
              />
            ))}
          </div>
          <div
            ref={mobileTrackRef}
            className="flex sm:hidden gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {stores.slice(0, 24).map((store: any) => (
              <div
                key={store.id}
                className="flex-shrink-0 w-[calc(33.33%-8px)]"
              >
                <StoreCard
                  store={store}
                  onClick={() => router.push(`/store/${store.id}`)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ─── Product Section ──────────────────────────────────────────
function ProductSection({
  id,
  title,
  viewAllHref,
  products,
  isLoading,
}: {
  id?: string;
  title: string;
  viewAllHref: string;
  products: any[];
  isLoading: boolean;
}) {
  const router = useRouter();
  return (
    <section
      id={id}
      className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          {title}
        </h2>
        <button
          onClick={() => router.push(viewAllHref)}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-blue-600 active:opacity-70 md:hover:text-blue-700 cursor-pointer"
        >
          Lihat Semua <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-xs text-gray-400">Belum ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function Home() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: allStores, isLoading: storesLoading } = useStores();

  const rekomendasiProduct = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [allProducts]);

  const rekomendasiToko = useMemo(() => {
    if (!allStores?.length) return [];
    return [...allStores].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [allStores]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-350 mx-auto px-3 md:px-8 py-3 md:py-6 space-y-3 md:space-y-5 pb-6">
        <BannerSlider />
        <GenderButtons />

        <div>
          <p>
            Section Baru Nanti Bikin Cara Menggunakan Langkaloka (jual, beli,
            rating, dll)
          </p>
        </div>

        <ProductSection
          id="rekomendasi"
          title="✨ Rekomendasi Untukmu"
          viewAllHref="/product/all"
          products={rekomendasiProduct}
          isLoading={productsLoading}
        />
        <StoreSlider stores={rekomendasiToko} isLoading={storesLoading} />
      </div>
    </main>
  );
}
