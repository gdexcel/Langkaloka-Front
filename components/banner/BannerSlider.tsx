'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Banner Data ──────────────────────────────────────────────
const banners = [
  {
    id: 1,
    type: 'buyer',
    src: '/images/banner/1-buyer.jpg',
    alt: 'Temukan Produk Keren, Harga Hemat – Banner Buyer',
    cta: 'Mulai Explore',
    ctaHref: '/product/all',
    // Accent color for dots / CTA outline (matches banner theme)
    accent: '#F97316', // orange
  },
  {
    id: 2,
    type: 'seller',
    src: '/images/banner/2-seller.jpg',
    alt: 'Jual Cepat, Untung Dekat – Banner Seller',
    cta: 'Mulai Jualan',
    ctaHref: '/sell',
    accent: '#0D9488', // teal
  },
  {
    id: 3,
    type: 'pembayaran',
    src: '/images/banner/3-pembayaran.jpg',
    alt: 'Chat, Langsung Bayar – Banner Pembayaran',
    cta: 'Pelajari Lebih Lanjut',
    ctaHref: '/help/payment',
    accent: '#9333EA', // purple
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function BannerSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right' = 'right') => {
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
    goTo(idx, 'left');
  }, [current, goTo]);

  const next = useCallback(() => {
    const idx = (current + 1) % banners.length;
    goTo(idx, 'right');
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

  // Reset timer on manual nav
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
    goTo(i, i > current ? 'right' : 'left');
    resetTimer();
  };

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl select-none group">
      {/* 
        Aspect ratio: 
        - Mobile: 16/7 (lebih crop, headline tetap kelihatan)
        - md+: 16/5 (landscape full seperti design aslinya)
        Gambar asli ~1500x500 (3:1), kita kasih sedikit ruang lebih tinggi di mobile
      */}
      <div className="relative w-full" style={{ aspectRatio: '16/6' }}>
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              i === current
                ? 'opacity-100 translate-x-0 z-10'
                : i < current
                  ? `opacity-0 z-0 ${
                      direction === 'right'
                        ? '-translate-x-full'
                        : 'translate-x-full'
                    }`
                  : `opacity-0 z-0 ${
                      direction === 'right'
                        ? 'translate-x-full'
                        : '-translate-x-full'
                    }`
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

        {/* Nav Arrows — hidden on mobile, visible on hover di desktop */}
        <button
          onClick={handlePrev}
          aria-label="Banner sebelumnya"
          className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 z-20
            w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm
            flex items-center justify-center text-white
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:bg-black/50 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Banner berikutnya"
          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-20
            w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-sm
            flex items-center justify-center text-white
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            hover:bg-black/50 active:scale-95"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? b.accent : 'rgba(255,255,255,0.55)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
