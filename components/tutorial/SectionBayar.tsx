"use client";

import { useState } from "react";
import StepItem from "./StepItem";

export default function SectionBayar() {
  const [method, setMethod] = useState<"transfer" | "cod">("transfer");

  return (
    <section id="bayar" className="scroll-mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <rect
              x="2"
              y="5"
              width="16"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Cara Bayar</h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Pilih metode yang cocok buat kamu
          </p>
        </div>
      </div>

      {/* Method toggle */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {/* Transfer */}
        <button
          onClick={() => setMethod("transfer")}
          className={`border-2 rounded-xl p-3.5 text-left transition-all ${
            method === "transfer"
              ? "border-blue-700 bg-blue-50"
              : "border-blue-100 bg-white hover:bg-blue-50/50"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-blue-700"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 8h12M9 5l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-900">Transfer</p>
          <p className="text-[11px] text-gray-400">Manual / VA</p>
        </button>

        {/* COD */}
        <button
          onClick={() => setMethod("cod")}
          className={`border-2 rounded-xl p-3.5 text-left transition-all ${
            method === "cod"
              ? "border-blue-700 bg-blue-50"
              : "border-blue-100 bg-white hover:bg-blue-50/50"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
            <svg
              className="w-4 h-4 text-blue-700"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 5v3l2 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-xs font-bold text-gray-900">COD</p>
          <p className="text-[11px] text-gray-400">Bayar di tempat</p>
        </button>
      </div>

      {/* Transfer steps */}
      {method === "transfer" && (
        <div className="flex flex-col">
          <StepItem
            number={1}
            title="Copy nomor rekening"
            description={
              <p>
                Cek halaman toko seller dan copy nomor rekening atau virtual
                account. Jika tidak tersedia, tanyakan langsung ke seller.
              </p>
            }
          />
          <StepItem
            number={2}
            title="Lakukan transfer"
            description={
              <p>
                Transfer sesuai nominal. Tips: dari room chat, klik{" "}
                <b className="text-gray-700">'Produk'</b> di atas untuk balik ke
                halaman produk.
              </p>
            }
          />
          <StepItem
            number={3}
            title="Klik 'Saya Sudah Bayar'"
            description={<p>Tap tombol verifikasi di halaman produk.</p>}
          />
          <StepItem
            number={4}
            isLast
            title="Upload & kabari seller"
            description={
              <p>
                Upload screenshot bukti transfer dan konfirmasi ke seller via
                chat.
              </p>
            }
          />
        </div>
      )}

      {/* COD steps */}
      {method === "cod" && (
        <div className="flex flex-col">
          <StepItem
            number={1}
            title="Pilih produk"
            description={<p>Temukan produk yang kamu mau di halaman utama.</p>}
          />
          <StepItem
            number={2}
            title="Chat Seller"
            description={
              <p>
                Klik tombol <b className="text-gray-700">'Chat Seller'</b> dari
                halaman produk.
              </p>
            }
          />
          <StepItem
            number={3}
            isLast
            title="Diskusi COD"
            description={
              <div>
                <p>Diskusi pembayaran COD bersama seller.</p>
                <div className="mt-3 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-500 mb-0.5">
                    Catatan dari Admin:
                  </p>
                  <p className="text-blue-700 font-bold text-sm">
                    Selamat COD (Cash or Duel) ⚔️
                  </p>
                  <p className="text-blue-500 text-xs mt-0.5">Semoga menang.</p>
                </div>
              </div>
            }
          />
        </div>
      )}
    </section>
  );
}
