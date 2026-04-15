'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, Store } from 'lucide-react';

const menus = [
  {
    name: 'Dashboard',
    href: '/store-panel',
    icon: LayoutDashboard,
  },
  {
    name: 'Produk Saya',
    href: '/store-panel/products',
    icon: Package,
  },
  {
    name: 'Tambah Produk',
    href: '/store-panel/sell',
    icon: PlusCircle,
  },
  {
    name: 'Setting Toko',
    href: '/store-panel/settings',
    icon: Store,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isMenuActive = (href: string) => pathname === href;

  return (
    <>
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Store Panel
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Kelola toko dengan navigasi sederhana dan cepat.
            </p>
          </div>

          <nav className="space-y-1.5">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isActive = isMenuActive(menu.href);

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'border border-blue-200 bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span>{menu.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 py-1 lg:hidden">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = isMenuActive(menu.href);

          return (
            <Link
              key={`mobile-${menu.href}`}
              href={menu.href}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={14} />
              {menu.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}
