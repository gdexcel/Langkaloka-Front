//langkaloka-v1\components\tutorial\TutorialStories.tsx
"use client";

import { useRouter } from "next/navigation";

const stories = [
  {
    id: "jualan",
    label: "Cara Jualan",
    color: "from-blue-500 to-blue-700",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
      </svg>
    ),
  },
  {
    id: "beli",
    label: "Cara Beli",
    color: "from-pink-400 to-rose-500",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: "bayar",
    label: "Cara Bayar",
    color: "from-emerald-400 to-teal-600",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
  },
  {
    id: "rating",
    label: "Rating Toko",
    color: "from-amber-400 to-orange-500",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "lapor",
    label: "Lapor Admin",
    color: "from-red-400 to-red-600",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: "feedback",
    label: "Feedback",
    color: "from-violet-400 to-purple-600",
    icon: (
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function TutorialStories() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-3 pt-3 pb-3.5">
      <p className="text-[10px] md:text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-1 mb-3">
        Tutorial
      </p>

      <div
        className="flex gap-3 md:gap-5 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => router.push(`/tutorial#${story.id}`)}
            className="flex flex-col items-center gap-1.5 flex shrink-0 active:scale-95 transition-transform duration-150 focus:outline-none"
          >
            {/* Gradient ring */}
            <div
              className={`bg-gradient-to-br ${story.color} p-[2.5px] rounded-full`}
            >
              <div className="bg-white p-0.5 rounded-full">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center`}
                >
                  {story.icon}
                </div>
              </div>
            </div>

            <span className="text-[10px] md:text-[11px] font-medium text-gray-500 text-center w-14 md:w-16 leading-tight">
              {story.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
