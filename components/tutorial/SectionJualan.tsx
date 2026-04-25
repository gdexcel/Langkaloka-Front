import StepItem from "./StepItem";

export default function SectionJualan() {
  return (
    <section id="jualan" className="scroll-mt-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4m12-4l2 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Cara Jualan</h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Mulai buka toko preloved kamu
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col">
        <StepItem
          number={1}
          title="Klik tombol 'Ayo Jualan'"
          description={
            <div className="space-y-2">
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded mb-1">
                  🖥 Desktop
                </span>
                <p>
                  Klik tombol <b className="text-gray-700">'Ayo Jualan'</b> pada
                  header.
                </p>
              </div>
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded mb-1">
                  📱 Mobile
                </span>
                <p>
                  Klik garis tiga di kanan atas, akan terlihat tombol{" "}
                  <b className="text-gray-700">'Ayo Jualan'</b>.
                </p>
              </div>
            </div>
          }
        />

        <StepItem
          number={2}
          title="Masuk ke Setting Toko"
          description={
            <div className="space-y-2">
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded mb-1">
                  🖥 Desktop
                </span>
                <p>
                  Setelah masuk ke dashboard Store Panel, pilih menu{" "}
                  <b className="text-gray-700">'Setting Toko'</b> di pilihan
                  menu sebelah kiri.
                </p>
              </div>
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded mb-1">
                  📱 Mobile — top menu
                </span>
                <p>
                  Atau geser menu bagian atas hingga menemukan{" "}
                  <b className="text-gray-700">'Setting Toko'</b>, lalu klik.
                </p>
              </div>
            </div>
          }
        />

        <StepItem
          number={3}
          title="Isi data & buat toko"
          description={
            <p>
              Isi semua data yang diminta, lalu klik tombol{" "}
              <b className="text-gray-700">'Buat Toko Sekarang'</b>.
            </p>
          }
        />

        <StepItem
          number={4}
          title="Lihat halaman tokomu"
          description={
            <p>
              Saat toko berhasil dibuat, buka menu{" "}
              <b className="text-gray-700">Dashboard</b> lalu klik tombol{" "}
              <b className="text-gray-700">'Lihat Tokomu'</b>.
            </p>
          }
        />

        <StepItem
          number={5}
          title="Upload produk pertamamu"
          description={
            <p>
              Klik menu <b className="text-gray-700">'Upload Product'</b>, lalu
              isi seluruh data produk yang ingin dijual.
            </p>
          }
        />

        <StepItem
          number={6}
          title="Edit produk kapan saja"
          isLast
          description={
            <div>
              <p>
                Pergi ke menu <b className="text-gray-700">'Produk Saya'</b>,
                lalu klik tombol <b className="text-gray-700">'Edit'</b> pada
                produk yang ingin diedit.
              </p>
              <div className="mt-3 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-blue-700 font-bold text-[15px]">
                  Selamat berjualan! 🎉
                </p>
                <p className="text-blue-500 text-xs mt-0.5">
                  Semoga produkmu laris manis, aamiin.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
