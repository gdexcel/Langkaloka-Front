//langkaloka-v1\components\store\StoreCard.tsx
"use client";

import { Store } from "lucide-react";
import { useState, useEffect } from "react";

interface StoreCardProps {
  store: {
    id: string;
    name: string;
    image?: string | null;
  };
  onClick?: () => void;
}

function getLetterColor(letter?: string): {
  bg: string;
  light: string;
  text: string;
} {
  const palettes = [
    { bg: "#f59e0b", light: "#fef3c7", text: "#92400e" },
    { bg: "#3b82f6", light: "#eff6ff", text: "#1e40af" },
    { bg: "#ec4899", light: "#fdf2f8", text: "#9d174d" },
    { bg: "#10b981", light: "#ecfdf5", text: "#065f46" },
    { bg: "#8b5cf6", light: "#f5f3ff", text: "#4c1d95" },
    { bg: "#ef4444", light: "#fef2f2", text: "#991b1b" },
    { bg: "#06b6d4", light: "#ecfeff", text: "#155e75" },
    { bg: "#f97316", light: "#fff7ed", text: "#9a3412" },
  ];
  const idx = (letter?.toUpperCase().charCodeAt(0) ?? 65) % palettes.length;
  return palettes[idx];
}

function useDominantColor(imageUrl?: string | null, fallbackLetter?: string) {
  const fallback = getLetterColor(fallbackLetter?.charAt(0));
  const [colors, setColors] = useState(fallback);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;
        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 240 || brightness < 15) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) return;
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        setColors({
          bg: `rgb(${r},${g},${b})`,
          light: `rgb(${Math.round(r + (255 - r) * 0.82)},${Math.round(g + (255 - g) * 0.82)},${Math.round(b + (255 - b) * 0.82)})`,
          text: `rgb(${Math.round(r * 0.35)},${Math.round(g * 0.35)},${Math.round(b * 0.35)})`,
        });
      } catch {}
    };
    img.onerror = () => {};
    img.src = imageUrl;
  }, [imageUrl]);

  return colors;
}

export default function StoreCard({ store, onClick }: StoreCardProps) {
  const colors = useDominantColor(store.image, store.name);

  return (
    <div
      onClick={onClick}
      className="min-w-0 flex flex-col cursor-pointer group"
    >
      <div
        className="w-full overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5"
        style={{
          borderRadius: 12,
          border: "0.5px solid rgba(0,0,0,0.08)",
          background: "#fff",
        }}
      >
        {/* Strip warna dominan */}
        <div
          style={{
            height: 6,
            background: colors.bg,
            transition: "background 0.3s",
          }}
        />

        {/* Body */}
        <div className="flex flex-col items-center gap-1.5 px-2 pt-3 pb-2.5">
          {/* Avatar */}
          <div
            className="group-hover:ring-2 group-hover:ring-blue-300 transition-all duration-200"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1.5px solid rgba(0,0,0,0.07)",
              background: colors.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {store.image ? (
              <img
                src={store.image}
                alt={store.name}
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.text,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {store.name?.charAt(0)?.toUpperCase() || (
                  <Store
                    style={{ width: 18, height: 18, color: colors.text }}
                  />
                )}
              </span>
            )}
          </div>

          {/* Nama toko */}
          <p
            className="text-[11px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center leading-tight select-none w-full"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
              minHeight: "2.4em",
            }}
          >
            {store.name}
          </p>
        </div>
      </div>
    </div>
  );
}
