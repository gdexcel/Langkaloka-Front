//langkaloka-v1\app\store-panel\layout.tsx
"use client";

import { Header } from "@/components/views/Header";
import Sidebar from "@/components/store/Sidebar";

export default function StorePanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Header />

      <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 md:px-6 lg:flex-row lg:gap-6 lg:py-6">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm md:p-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
