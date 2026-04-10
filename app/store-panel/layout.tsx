"use client"

import { Header } from "@/components/views/Header"
import Sidebar from "@/components/store/Sidebar"

export default function StorePanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">

      <Header />

     <div className="flex">

  {/* 🔥 SIDEBAR BARU */}
  <Sidebar />

  {/* 🔥 CONTENT */}
  <div className="flex-1 p-6">
    {children}
  </div>

</div>

    </main>
  )
}