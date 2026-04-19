"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerTransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("/api/seller/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // 🔥 APPROVE FUNCTION (DITAMBAH)
  const handleApprove = async (tx: any) => {
    console.log("TX DATA:",tx);
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        "/api/transactions/approve",
        {
          transactionId: tx.id,
          productId: tx.productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pembayaran disetujui!");

      fetchData(); // 🔥 refresh data
    } catch (error) {
      console.error(error);
      alert("Gagal approve");
    }
  };

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading transaksi...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transaksi Masuk</h1>

      {/* 🔥 EMPTY STATE */}
      {data.length === 0 && (
        <p className="text-gray-400">Belum ada bukti transfer masuk</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((tx) => (
          <div
            key={tx.id}
            className="border rounded-xl p-3 shadow-sm hover:shadow-md transition"
          >
            {/* IMAGE */}
            <img
              src={tx.proof}
              className="w-full h-40 object-cover rounded"
            />

            {/* INFO */}
            <p className="mt-2 text-sm font-semibold">
              {tx.productName || "Produk"}
            </p>

            <p className="text-xs text-gray-400">
              {tx.createdAt
                ? new Date(tx.createdAt).toLocaleString()
                : ""}
            </p>

            {/* 🔥 STATUS + BUTTON */}
            {tx.status === "approved" ? (
              <p className="text-green-600 text-xs mt-2 font-semibold">
                ✔ Sudah disetujui
              </p>
            ) : (
              <button
                onClick={() => handleApprove(tx)}
                className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}