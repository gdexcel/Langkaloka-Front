// langkaloka-v1/components/ui/Lightbox.tsx
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  activeIndex: number;
  productName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}

const SWIPE_THRESHOLD = 50;

export function Lightbox({
  images,
  activeIndex,
  productName,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);

  // Touch hanya pada area GAMBAR, bukan seluruh modal
  const handleImageTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleImageTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? onNext() : onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-999 flex flex-col"
      style={{ background: "rgba(0,0,0,0.96)", animation: "fadeIn 0.2s ease" }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0 }             to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0;transform:scale(0.96) } to { opacity:1;transform:scale(1) } }
      `}</style>

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)",
        }}
      >
        {/* Dot indicators */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 18 : 6,
                height: 6,
                background:
                  i === activeIndex ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>

        <span
          className="text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {activeIndex + 1} / {images.length}
        </span>

        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer"
          style={{
            width: 40,
            height: 40,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* ── Image area (swipe hanya di sini) ── */}
      <div
        className="relative flex flex-1 items-center justify-center px-14 overflow-hidden"
        onTouchStart={handleImageTouchStart}
        onTouchEnd={handleImageTouchEnd}
      >
        <img
          key={activeIndex}
          src={images[activeIndex]}
          alt={`${productName} - foto ${activeIndex + 1}`}
          draggable={false}
          className="max-h-[85dvh] max-w-full select-none object-contain"
          style={{ animation: "scaleIn 0.2s ease" }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-95 hover:scale-105 md:left-5"
              style={{
                width: 44,
                height: 44,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-95 hover:scale-105 md:right-5"
              style={{
                width: 44,
                height: 44,
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div
          className="shrink-0 px-4 py-4"
          style={{
            background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
          }}
        >
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className="flex shrink-0 overflow-hidden rounded-lg transition-all duration-200"
                style={{
                  width: 52,
                  height: 52,
                  border:
                    i === activeIndex
                      ? "2px solid rgba(255,255,255,0.9)"
                      : "2px solid rgba(255,255,255,0.2)",
                  opacity: i === activeIndex ? 1 : 0.55,
                  transform: i === activeIndex ? "scale(1.05)" : "scale(1)",
                }}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
