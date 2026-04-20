// langkaloka-v1\app\store-panel\page.tsx
"use client";

import { useStoreStats } from "@/hooks/useStoreStats";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  Store,
  ArrowUpRight,
} from "lucide-react";

const statCards = [
  {
    key: "total",
    label: "Total Produk",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: Package,
  },
  {
    key: "sold",
    label: "Terjual",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  {
    key: "active",
    label: "Masih Dijual",
    color: "text-violet-700",
    bg: "bg-violet-50",
    icon: ShoppingBag,
  },
] as const;

export default function StorePanelPage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useStoreStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      </div>
    );
  }

  const values = {
    total: data?.total ?? 0,
    sold: data?.sold ?? 0,
    active: data?.active ?? 0,
  };

  const storeId = data?.storeId; // ✅ langsung dari API

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Ringkasan
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Dashboard Toko
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau performa toko dan kelola produk dengan cepat.
          </p>
        </div>

        {/* ✅ TOMBOL LIHAT TOKOMU */}
        {storeId && (
          <a
            href={`/store/${storeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group flex shrink-0 items-center gap-2 self-start
              rounded-xl border border-blue-200 bg-blue-50
              px-4 py-2.5 text-sm font-semibold text-blue-700
              transition-all duration-200
              hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-100
              active:scale-95
            "
          >
            <Store className="h-4 w-4 transition-transform group-hover:scale-110" />
            Lihat Tokomu
            <ArrowUpRight className="h-4 w-4 opacity-60 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                {values[card.key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
