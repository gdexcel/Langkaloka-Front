// langkaloka-v1/components/banner/BannerSlider.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    type: "buyer",
    src: "/images/banner/1-buyer.jpg",
    alt: "Temukan Produk Keren, Harga Hemat – Banner Buyer",
    cta: "Mulai Explore",
    ctaHref: "#rekomendasi",
    accent: "#F97316",
  },
  {
    id: 2,
    type: "seller",
    src: "/images/banner/2-seller.jpg",
    alt: "Jual Cepat, Untung Dekat – Banner Seller",
    cta: "Mulai Jualan",
    ctaHref: "/store-panel/sell",
    accent: "#0D9488",
  },
  {
    id: 3,
    type: "pembayaran",
    src: "/images/banner/3-pembayaran.jpg",
    alt: "Chat, Langsung Bayar – Banner Pembayaran",
    cta: "Pelajari Lebih Lanjut",
    ctaHref: "/tutorial/cara-pesan",
    accent: "#9333EA",
  },
];

const AUTOPLAY_INTERVAL = 5000;
// Minimum px drag sebelum dianggap swipe (bukan tap)
const SWIPE_THRESHOLD = 40;

export default function BannerSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Touch tracking ──────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isSwiping = useRef(false); // true kalau drag melebihi threshold

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating],
  );

  const prev = useCallback(() => {
    const idx = (current - 1 + banners.length) % banners.length;
    goTo(idx, "left");
  }, [current, goTo]);

  const next = useCallback(() => {
    const idx = (current + 1) % banners.length;
    goTo(idx, "right");
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, AUTOPLAY_INTERVAL);
  }, []);

  const handlePrev = () => {
    prev();
    resetTimer();
  };
  const handleNext = () => {
    next();
    resetTimer();
  };
  const handleDot = (i: number) => {
    goTo(i, i > current ? "right" : "left");
    resetTimer();
  };

  // ── Touch handlers ──────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    isSwiping.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    if (
      touchStartX.current !== null &&
      Math.abs(touchEndX.current - touchStartX.current) > SWIPE_THRESHOLD
    ) {
      isSwiping.current = true;
    }
  };

  const onTouchEnd = () => {
    if (
      !isSwiping.current ||
      touchStartX.current === null ||
      touchEndX.current === null
    )
      return;
    const delta = touchStartX.current - touchEndX.current;
    if (delta > SWIPE_THRESHOLD) {
      // swipe kiri → next
      handleNext();
    } else if (delta < -SWIPE_THRESHOLD) {
      // swipe kanan → prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    isSwiping.current = false;
  };

  // ── Banner click (hanya kalau bukan swipe) ──────────────────
  const handleBannerClick = () => {
    if (isSwiping.current) return; // abaikan kalau habis swipe
    const href = banners[current].ctaHref;
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(href);
    }
  };

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl select-none group">
      <div
        className="relative w-full cursor-pointer"
        style={{ aspectRatio: "16/6" }}
        onClick={handleBannerClick}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              i === current
                ? "opacity-100 translate-x-0 z-10"
                : i < current
                  ? `opacity-0 z-0 ${direction === "right" ? "-translate-x-full" : "translate-x-full"}`
                  : `opacity-0 z-0 ${direction === "right" ? "translate-x-full" : "-translate-x-full"}`
            }`}
          >
            <Image
              src={b.src}
              alt={b.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
              className="object-cover object-center"
              draggable={false}
            />
          </div>
        ))}

        {/* Nav Arrows
            - Mobile  : selalu visible, ukuran lebih kecil (w-7 h-7)
            - Desktop : muncul saat hover group (opacity-0 group-hover:opacity-100)
        */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Banner sebelumnya"
          className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-20
            w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm
            flex items-center justify-center text-white
            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
            transition-opacity duration-200
            hover:bg-black/50 active:scale-95"
        >
          <ChevronLeft className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Banner berikutnya"
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-20
            w-7 h-7 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm
            flex items-center justify-center text-white
            opacity-100 lg:opacity-0 lg:group-hover:opacity-100
            transition-opacity duration-200
            hover:bg-black/50 active:scale-95"
        >
          <ChevronRight className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={(e) => {
                e.stopPropagation();
                handleDot(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                background: i === current ? b.accent : "rgba(255,255,255,0.55)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
