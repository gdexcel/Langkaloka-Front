"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import SignupPage from "./Signup";
import { LoginForm } from "./fragments/LoginForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import {
  Store,
  Heart,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Search,
  ClipboardList,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  startsWith?: boolean;
  onClick?: () => void;
  badge?: number;
};

type ChatListUpdateEvent = {
  chatId?: string;
  text?: string;
  senderId?: string;
  buyerId?: string;
  sellerId?: string;
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useCurrentUser();

  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll-based searchbar visibility
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastEventRef = useRef<string | null>(null);
  const prevPathnameRef = useRef(pathname);

  // ── Scroll listener: hide on scroll-down, show on scroll-up ──
  useEffect(() => {
    const THRESHOLD = 10; // minimum px movement before reacting
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY <= 10) {
          setSearchBarVisible(true);
        } else if (currentY > lastScrollY.current + THRESHOLD) {
          setSearchBarVisible(false);
        } else if (currentY < lastScrollY.current - THRESHOLD) {
          setSearchBarVisible(true);
        }
        // delta < THRESHOLD → abaikan, jangan update state sama sekali

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/search") return;
    const q = searchParams.get("q") || "";
    setSearchQuery((prev) => (prev === q ? prev : q));
  }, [pathname, searchParams]);

  useEffect(() => {
    audioRef.current = new Audio("/notif.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const unlock = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {});
    };
    document.addEventListener("click", unlock, { once: true });
    return () => document.removeEventListener("click", unlock);
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const sendPing = () => {
      fetch("/api/user/online", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    sendPing();
    const interval = setInterval(sendPing, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("chat-list");

    const onChatListUpdate = (data: ChatListUpdateEvent) => {
      const myId = localStorage.getItem("userId");
      if (!myId) return;

      const normalizedMyId = String(myId);
      const senderId = String(data.senderId ?? "");
      const buyerId = String(data.buyerId ?? "");
      const sellerId = String(data.sellerId ?? "");
      const chatId = String(data.chatId ?? "");
      const text = String(data.text ?? "");

      if (!chatId || !text) return;
      if (senderId === normalizedMyId) return;

      const isParticipant =
        buyerId === normalizedMyId || sellerId === normalizedMyId;
      if (!isParticipant) return;

      const currentChatId = window.location.pathname.split("/chat/")[1];
      if (currentChatId === chatId) return;

      const eventKey = `${chatId}-${text}-${senderId}`;
      if (lastEventRef.current === eventKey) return;
      lastEventRef.current = eventKey;

      setNotif((prev) => prev + 1);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      }
    };

    channel.bind("update", onChatListUpdate);

    return () => {
      channel.unbind("update", onChatListUpdate);
      pusher.unsubscribe("chat-list");
      pusher.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/chat")) {
      setNotif(0);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    router.push("/");
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setMobileMenuOpen(false);
  };

  const userInitial = (user?.name || user?.email)?.[0]?.toUpperCase() || "U";
  const userName = user?.name || user?.email?.split("@")[0] || "";

  const navItems: NavItem[] = [
    { label: "Wishlist", path: "/wishlist", icon: Heart },
    {
      label: "Chat",
      path: "/chat",
      icon: MessageCircle,
      startsWith: true,
      onClick: () => setNotif(0),
      badge: notif,
    },
    { label: "Feedback", path: "/feedback", icon: ClipboardList },
  ];

  const isActive = (item: NavItem) =>
    item.startsWith ? pathname.startsWith(item.path) : pathname === item.path;

  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        {/* ── TIER 1: Logo + Actions (always visible) ── */}
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 lg:px-6">
          {/* LEFT — Logo */}
          <button
            onClick={() => router.push("/")}
            className="group flex shrink-0 items-center gap-2 cursor-pointer"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg ring-2 ring-blue-100 transition-all group-hover:ring-blue-300">
              <Image
                src="/langkaloka-logo.png"
                alt="LangkaLoka"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              LangkaLoka
            </span>
          </button>

          {/* CENTER — Search bar (desktop only, inline) */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 lg:flex justify-center px-4"
          >
            <div className="relative w-full max-w-lg">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang preloved..."
                className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-20 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 rounded-full bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                Cari
              </button>
            </div>
          </form>

          {/* RIGHT — Actions */}
          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            {isLoading ? (
              <div className="h-9 w-48 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <div className="hidden lg:flex items-center gap-1.5">
                {/* Ayo Jualan CTA */}
                <button
                  onClick={() => router.push("/store-panel")}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-gray-800 px-4 text-sm font-semibold text-white transition hover:bg-gray-900 active:scale-95 cursor-pointer"
                >
                  <span>Ayo Jualan</span>
                </button>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <button
                      key={`top-${item.label}`}
                      onClick={() => {
                        item.onClick?.();
                        router.push(item.path);
                      }}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5" />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="mx-1 h-5 w-px bg-gray-200" />

                {/* Profile button */}
                <button
                  onClick={() => router.push("/account")}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-3 py-1 text-sm transition hover:border-blue-200 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white">
                    {userInitial}
                  </div>
                  <span className="hidden max-w-25 truncate text-[13px] font-medium text-gray-700 lg:block">
                    {userName}
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setOpen(true);
                  }}
                  className="h-9 rounded-full border border-gray-200 px-4 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setOpen(true);
                  }}
                  className="h-9 rounded-full bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}

            {/* Mobile/Tablet — Hamburger only */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 lg:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* ── TIER 2: Searchbar (mobile/tablet only, scroll-sensitive) ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            searchBarVisible ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-3 pt-0">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari items dan brands"
                  className="h-10 w-full rounded-full border border-gray-200 bg-gray-100 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* ─── MOBILE DRAWER BACKDROP ─── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ─── MOBILE DRAWER ─── */}
      <div
        className={`fixed right-0 top-0 z-50 h-dvh w-80 bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-lg">
              <Image
                src="/langkaloka-logo.png"
                alt="LangkaLoka"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-sm font-bold text-gray-900">LangkaLoka</span>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(100%-3.5rem)] flex-col overflow-y-auto">
          <div className="flex-1 p-4 space-y-1">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : user ? (
              <>
                {/* Profile card */}
                <button
                  onClick={() => {
                    router.push("/account");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-3 mb-4 transition hover:bg-blue-100 cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {userInitial}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-[13px] font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="truncate text-[11px] text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </button>

                {/* Ayo Jualan — full width CTA */}
                <button
                  onClick={() => {
                    router.push("/store-panel");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-blue-600 px-4 py-3 mb-4 transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Store className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-white">
                      Ayo Jualan
                    </p>
                    <p className="text-[11px] text-blue-200">
                      Buka toko sekarang
                    </p>
                  </div>
                </button>

                {/* Divider label — Kategori */}
                <p className="px-1 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Gender
                </p>

                {/* Wanita */}
                <button
                  onClick={() => {
                    router.push("/product/all/women");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-600 cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-500 group-hover:bg-pink-200 transition">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <line x1="12" y1="13" x2="12" y2="21" />
                      <line x1="9" y1="18" x2="15" y2="18" />
                    </svg>
                  </div>
                  <span>Wanita</span>
                  <span className="ml-auto text-[11px] text-gray-400">
                    Produk wanita
                  </span>
                </button>

                {/* Pria */}
                <button
                  onClick={() => {
                    router.push("/product/all/men");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-500 group-hover:bg-blue-200 transition">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="10" cy="14" r="5" />
                      <line x1="21" y1="3" x2="15" y2="9" />
                      <polyline points="16 3 21 3 21 8" />
                    </svg>
                  </div>
                  <span>Pria</span>
                  <span className="ml-auto text-[11px] text-gray-400">
                    Produk pria
                  </span>
                </button>

                {/* Divider label — Menu */}
                <p className="px-1 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Menu
                </p>

                {/* Nav items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <button
                      key={`m-${item.label}`}
                      onClick={() => {
                        item.onClick?.();
                        router.push(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition cursor-pointer ${
                        active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          active ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-[13px] text-gray-500 px-1">
                  Masuk untuk mulai belanja dan jualan.
                </p>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl border border-gray-200 py-3 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Logout footer */}
          {user && !isLoading && (
            <div className="border-t border-gray-100 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── AUTH DIALOG ─── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Masuk" : "Buat Akun"}</DialogTitle>
          </DialogHeader>
          {isLogin ? (
            <>
              <LoginForm onSuccess={() => setOpen(false)} />
              <p className="text-center text-[13px] text-gray-500">
                Belum punya akun?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="cursor-pointer font-semibold text-blue-600 hover:underline"
                >
                  Daftar
                </span>
              </p>
            </>
          ) : (
            <SignupPage
              onSuccess={() => setIsLogin(true)}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
