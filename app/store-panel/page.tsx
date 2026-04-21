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
  TrendingUp,
} from "lucide-react";

const statCards = [
  {
    key: "total",
    label: "Total Produk",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: Package,
    desc: "Semua produk terdaftar",
  },
  {
    key: "sold",
    label: "Terjual",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: CheckCircle2,
    desc: "Produk sudah laku",
  },
  {
    key: "active",
    label: "Masih Dijual",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    icon: ShoppingBag,
    desc: "Produk aktif",
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
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3.5 w-20 animate-pulse rounded-full bg-gray-100" />
            <div className="h-7 w-44 animate-pulse rounded-lg bg-gray-100" />
            <div className="h-3.5 w-64 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
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

  const storeId = data?.storeId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Ringkasan
            </p>
          </div>
          <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
            Dashboard Toko
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Pantau performa dan kelola produk lo dengan cepat.
          </p>
        </div>

        {storeId && (
          <a
            href={`/store/${storeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95 sm:w-auto"
          >
            <Store className="h-4 w-4 transition-transform group-hover:scale-110" />
            Lihat Tokomu
            <ArrowUpRight className="h-4 w-4 opacity-60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </a>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`rounded-2xl border ${card.border} bg-white p-5 shadow-sm transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{card.desc}</p>
                </div>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {values[card.key]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
