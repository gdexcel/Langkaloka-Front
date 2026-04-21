// langkaloka-v1\app\store-panel\transactions\page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Clock, Receipt } from "lucide-react";
import Image from "next/image";

type Transaction = {
  id: string;
  productId: string;
  productName?: string;
  proof: string;
  status: string;
  createdAt?: string;
};

export default function SellerTransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/seller/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (tx: Transaction) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "/api/transactions/approve",
        { transactionId: tx.id, productId: tx.productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Pembayaran disetujui!");
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Gagal approve");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Keuangan
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          Transaksi Masuk
        </h1>
        <p className="mt-0.5 text-sm text-gray-400">
          Verifikasi bukti transfer dari pembeli.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="h-36 animate-pulse bg-gray-100 sm:h-40" />
              <div className="space-y-2 p-3">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-8 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Receipt className="h-7 w-7 text-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Belum ada transaksi</p>
            <p className="mt-1 text-sm text-gray-400">
              Bukti transfer dari pembeli akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        /* Transaction Grid */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Proof image */}
              <div className="relative h-36 w-full shrink-0 bg-gray-100 sm:h-40">
                {tx.proof && (
                  <Image
                    src={tx.proof}
                    alt="Bukti transfer"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                  {tx.productName || "Produk"}
                </p>

                {tx.createdAt && (
                  <p className="text-[11px] text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}

                {/* Status / Action */}
                <div className="mt-auto pt-2">
                  {tx.status === "approved" ? (
                    <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Disetujui
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApprove(tx)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
