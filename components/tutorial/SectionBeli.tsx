import StepItem from "./StepItem";

export default function SectionBeli() {
  return (
    <section id="beli" className="scroll-mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Cara Beli</h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Proses transaksi via chat dengan seller
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 border-l-[3px] border-l-blue-700 rounded-xl p-3 mb-5">
        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
          Info
        </p>
        <p className="text-xs text-blue-600 leading-relaxed">
          Untuk saat ini, pembayaran dilakukan via transfer manual atau COD.
          Semua transaksi diproses melalui chat bersama toko. Payment gateway &
          pengiriman akan hadir segera!
        </p>
      </div>

      <div className="flex flex-col">
        <StepItem
          number={1}
          title="Chat Seller"
          description={
            <p>
              Setelah memilih produk, klik{" "}
              <b className="text-gray-700">'Chat Seller'</b> untuk konfirmasi
              ketersediaan.
            </p>
          }
        />
        <StepItem
          number={2}
          title="Sepakati pembayaran"
          description={
            <p>
              Diskusikan metode pembayaran dengan seller — transfer atau COD.
              Copy nomor rekening dari halaman toko seller.
            </p>
          }
        />
        <StepItem
          number={3}
          title="Klik 'Saya Sudah Bayar'"
          description={
            <p>
              Kembali ke halaman produk (atau klik{" "}
              <b className="text-gray-700">'Produk'</b> di bagian atas room
              chat), lalu klik tombol verifikasi.
            </p>
          }
        />
        <StepItem
          number={4}
          title="Upload bukti pembayaran"
          description={
            <p>
              Upload foto/screenshot bukti transfer, lalu kabari seller lewat
              chat.
            </p>
          }
        />
        <StepItem
          number={5}
          title="Minta nomor resi"
          isLast
          description={
            <p>
              Minta link shipping atau nomor resi kepada seller sebagai bukti
              produk sudah dikirim.
            </p>
          }
        />
      </div>
    </section>
  );
}
