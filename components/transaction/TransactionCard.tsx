// langkaloka-v1/components/transactions/TransactionCard.tsx
"use client";

import { CheckCircle2, Clock } from "lucide-react";

type Transaction = {
  id: string;
  productId: string;
  productName?: string;
  proof: string;
  status: string;
  createdAt?: string;
};

interface Props {
  tx: Transaction;
  onApprove: (tx: Transaction) => void;
  onImageClick: (url: string) => void;
}

export function TransactionCard({ tx, onApprove, onImageClick }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* Proof image — clickable */}
      <div
        className="relative h-36 w-full shrink-0 bg-gray-100 sm:h-40 cursor-zoom-in"
        onClick={() => tx.proof && onImageClick(tx.proof)}
      >
        {tx.proof && (
          <img
            src={tx.proof}
            alt="Bukti transfer"
            className="h-full w-full object-cover"
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

        <div className="mt-auto pt-2">
          {tx.status === "approved" ? (
            <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Disetujui
            </div>
          ) : (
            <button
              onClick={() => onApprove(tx)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
            >
              <Clock className="h-3.5 w-3.5" />
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
