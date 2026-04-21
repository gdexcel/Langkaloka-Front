// hooks/useStoreCard.ts
import { useState, useEffect } from "react"; // ← ini yang kurang

// Warna fallback deterministik dari huruf pertama nama toko
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

// Hook untuk extract dominant color dari gambar pakai Canvas
export function useDominantColor(
  imageUrl?: string | null,
  fallbackLetter?: string,
) {
  const fallback = getLetterColor(fallbackLetter?.charAt(0));
  const [colors, setColors] = useState(fallback);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 16;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

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

        const lightR = Math.round(r + (255 - r) * 0.82);
        const lightG = Math.round(g + (255 - g) * 0.82);
        const lightB = Math.round(b + (255 - b) * 0.82);

        const darkR = Math.round(r * 0.35);
        const darkG = Math.round(g * 0.35);
        const darkB = Math.round(b * 0.35);

        setColors({
          bg: `rgb(${r},${g},${b})`,
          light: `rgb(${lightR},${lightG},${lightB})`,
          text: `rgb(${darkR},${darkG},${darkB})`,
        });
      } catch {
        // CORS error atau canvas tainted — tetap pakai fallback
      }
    };

    img.onerror = () => {};
    img.src = imageUrl;
  }, [imageUrl]);

  return colors;
}
