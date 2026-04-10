"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  PlusCircle
} from "lucide-react"

const menus = [
  {
    name: "Dashboard",
    href: "/store-panel",
    icon: LayoutDashboard
  },
  {
    name: "Produk Saya",
    href: "/store-panel/products",
    icon: Package
  },
  {
    name: "Tambah Produk",
    href: "/sell",
    icon: PlusCircle
  }
]

export default function Sidebar() {

  const pathname = usePathname()

  return (
    <aside className="w-64 border-r min-h-screen p-4">

      <h2 className="font-bold text-lg mb-6">
        Seller Panel
      </h2>

      <div className="flex flex-col gap-2">

        {menus.map((menu) => {

          const isActive = pathname === menu.href

          const Icon = menu.icon

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${isActive 
                  ? "bg-black text-white" 
                  : "hover:bg-gray-100"
                }
              `}
            >
              <Icon size={18} />
              {menu.name}
            </Link>
          )
        })}

      </div>

    </aside>
  )
}