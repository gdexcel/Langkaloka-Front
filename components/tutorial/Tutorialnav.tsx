"use client";

import { useState } from "react";

const navItems = [
  { id: "jualan", label: "Cara Jualan" },
  { id: "beli", label: "Cara Beli" },
  { id: "bayar", label: "Cara Bayar" },
  { id: "lapor", label: "Lapor Admin" },
  { id: "rating", label: "Rating" },
  { id: "feedback", label: "Feedback" },
];

export default function TutorialNav() {
  const [active, setActive] = useState("jualan");

  const handleClick = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto  bg-white border-b border-blue-50 px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`flex cursor-pointer shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border-[1.5px] transition-all duration-200 ${
            active === item.id
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-blue-700 border-blue-100 hover:bg-blue-50"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
