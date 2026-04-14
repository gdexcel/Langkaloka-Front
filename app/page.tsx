"use client";

import { Header } from "@/components/views/Header";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/products/ProductCard";

export default function Home() {
  const { data: products, isLoading } = useProducts();

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Header />

      {/* 🔥 HERO SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary/90 to-blue-600 bg-clip-text text-transparent mb-6">
            Temukan Barang Preloved Langka
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Marketplace preloved terlengkap. Chat langsung dengan seller, deal
            harga, ambil barang.
          </p>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/50">
            <p className="text-lg font-medium text-foreground/80">
              💙 Barang preloved berkualitas • Harga nego • Bayar COD • Chat
              real-time
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pb-12 flex-1">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Produk Terbaru</h2>
          <p className="text-sm text-gray-400">
            {products?.length || 0} barang tersedia
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 animate-pulse shadow-md"
              >
                <div className="bg-gray-200 rounded-lg aspect-square mb-3"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 PRODUCTS GRID */}
        {!isLoading && products?.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛍️</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Belum ada produk
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Jadi yang pertama jualan di LangkaLoka!
            </p>
          </div>
        ) : (
          <div
            className="grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-6
          "
          >
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 🔥 CTA Bottom */}
        {products && products.length > 0 && (
          <div className="mt-12 text-center bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-2">
              Tertarik Jualan?
            </h3>
            <p className="text-muted-foreground mb-4">
              Toko gratis, unlimited listing preloved.
            </p>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              🚀 Mulai Jualan
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
