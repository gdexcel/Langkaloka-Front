// langkaloka-v1/hooks/useLightbox.ts
import { useState, useEffect, useCallback } from "react";

export function useLightbox(imageList: string[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = useCallback((index: number = 0) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? imageList.length - 1 : i - 1));
  }, [imageList.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i === imageList.length - 1 ? 0 : i + 1));
  }, [imageList.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, next, prev, close]);

  return { isOpen, activeIndex, setActiveIndex, open, close, prev, next };
}
