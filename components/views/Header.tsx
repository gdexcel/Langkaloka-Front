"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
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
  MessageSquareText,
  User,
  Settings,
  Search,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useCurrentUser();

  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔥 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastEventRef = useRef<string | null>(null);

  // Sync search query dari URL kalau lagi di /search
  useEffect(() => {
    if (pathname === "/search") {
      const q = searchParams.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
  }, [pathname, searchParams]);

  // 🔥 INIT AUDIO
  useEffect(() => {
    audioRef.current = new Audio("/notif.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  // 🔥 UNLOCK AUDIO
  useEffect(() => {
    const unlock = () => {
      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("click", unlock, { once: true });
    return () => document.removeEventListener("click", unlock);
  }, []);

  // 🟢 ONLINE PING
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const sendPing = () => {
      fetch("/api/user/online", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    sendPing();
    const interval = setInterval(sendPing, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // 🔥 PUSHER
  useEffect(() => {
    if (!user) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe("chat-list");

    channel.bind("update", (data: any) => {
      const myId = localStorage.getItem("userId");

      if (data.senderId === myId) return;
      if (!data.text) return;

      const currentChatId = window.location.pathname.split("/chat/")[1];
      if (currentChatId === data.chatId) return;

      const eventKey = `${data.chatId}-${data.text}`;
      if (lastEventRef.current === eventKey) return;

      lastEventRef.current = eventKey;

      setNotif((prev) => prev + 1);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    router.push("/");
    setMobileMenuOpen(false);
  };

  // 🔥 HANDLE SEARCH — redirect ke /search?q=keyword
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const isActivePath = (path: string) => pathname === path;

  // Ambil initial untuk avatar
  const userInitial = (user?.name || user?.email)?.[0]?.toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        {/* ====== LAYER 1 — Main Navigation ====== */}
        <div className="border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              {/* ====== LOGO ====== */}
              <button
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => router.push("/")}
              >
                {/* logo */}
                <Image
                  src="/langkaloka-logo.png"
                  alt="LangkaLoka Logo"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                  unoptimized
                />
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent hidden sm:block">
                  LangkaLoka
                </span>
              </button>

              {/* ====== DESKTOP NAV ====== */}
              <nav className="hidden md:flex items-center gap-1">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-9 bg-blue-50 animate-pulse rounded-lg" />
                    <div className="w-20 h-9 bg-blue-50 animate-pulse rounded-lg" />
                    <div className="w-24 h-9 bg-blue-50 animate-pulse rounded-lg" />
                  </div>
                ) : (
                  <>
                    {user && (
                      <>
                        {/* Seller */}
                        <button
                          onClick={() => router.push("/store-panel")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            pathname.startsWith("/store-panel")
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                          }`}
                        >
                          <Store className="w-4 h-4" />
                          <span>Jualan</span>
                        </button>

                        {/* Wishlist */}
                        <button
                          onClick={() => router.push("/wishlist")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActivePath("/wishlist")
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                          <span>Wishlist</span>
                        </button>

                        {/* Chat */}
                        <button
                          onClick={() => {
                            router.push("/chat");
                            setNotif(0);
                          }}
                          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            pathname.startsWith("/chat")
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat</span>
                          {notif > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5 shadow-sm">
                              {notif > 99 ? "99+" : notif}
                            </span>
                          )}
                        </button>

                        {/* Feedback */}
                        <button
                          onClick={() => router.push("/feedback")}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                            isActivePath("/feedback")
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                          }`}
                        >
                          <MessageSquareText className="w-4 h-4" />
                          <span>Feedback</span>
                        </button>
                      </>
                    )}
                  </>
                )}
              </nav>

              {/* ====== RIGHT SECTION (Auth) ====== */}
              <div className="flex items-center gap-3">
                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-3">
                  {!isLoading && (
                    <>
                      {user ? (
                        <div className="flex items-center gap-2">
                          {/* Account Button */}
                          <button
                            onClick={() => router.push("/account")}
                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                              isActivePath("/account")
                                ? "bg-blue-100 ring-2 ring-blue-300"
                                : "bg-blue-50 hover:bg-blue-100"
                            }`}
                            title="Pengaturan Akun"
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-sm font-bold text-white">
                                {userInitial}
                              </span>
                            </div>
                            <div className="text-left hidden lg:block">
                              <p className="text-sm font-medium text-gray-800 max-w-[100px] truncate leading-tight">
                                {user.name || user.email?.split("@")[0]}
                              </p>
                              <p className="text-[11px] text-blue-500 leading-tight">
                                Akun Saya
                              </p>
                            </div>
                          </button>

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                            title="Logout"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setOpen(true)}
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Masuk
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* ====== MOBILE HAMBURGER ====== */}
                <button
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ====== LAYER 2 — Search Bar ====== */}
        <div className=" border-b border-blue-100/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-blue-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari barang preloved... (misal: iPhone, sneakers Nike, tas branded)"
                  className="w-full pl-12 pr-28 py-3 bg-white border border-blue-200/60 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all shadow-sm hover:shadow-md hover:border-blue-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* ====== MOBILE MENU OVERLAY ====== */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ====== MOBILE MENU PANEL ====== */}
      <div
        className={`fixed top-[7.375rem] right-0 z-50 w-72 bg-white shadow-2xl border-l border-blue-100 transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "calc(100vh - 7.375rem)" }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Nav Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {isLoading ? (
              <div className="space-y-3 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-11 bg-blue-50 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : user ? (
              <>
                {/* User Info — Klik ke /account */}
                <button
                  onClick={() => {
                    router.push("/account");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 mb-3 rounded-2xl transition-all cursor-pointer ${
                    isActivePath("/account")
                      ? "bg-blue-100 ring-2 ring-blue-300"
                      : "bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-100"
                  }`}
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg font-bold text-white">
                      {userInitial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-blue-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Settings className="w-4 h-4 text-blue-400" />
                </button>

                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                  Navigasi
                </p>

                {/* Store Panel */}
                <button
                  onClick={() => {
                    router.push("/store-panel");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    pathname.startsWith("/store-panel")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Jualan
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => {
                    router.push("/wishlist");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActivePath("/wishlist")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>

                {/* Chat */}
                <button
                  onClick={() => {
                    router.push("/chat");
                    setNotif(0);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    pathname.startsWith("/chat")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat
                  {notif > 0 && (
                    <span className="ml-auto min-w-[22px] h-5 flex items-center justify-center bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5">
                      {notif > 99 ? "99+" : notif}
                    </span>
                  )}
                </button>

                {/* Feedback */}
                <button
                  onClick={() => {
                    router.push("/feedback");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActivePath("/feedback")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                  }`}
                >
                  <MessageSquareText className="w-5 h-5" />
                  Feedback
                </button>

                <p className="px-3 pt-4 pb-1 text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                  Akun
                </p>

                {/* Account Settings */}
                <button
                  onClick={() => {
                    router.push("/account");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActivePath("/account")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-blue-50/60 hover:text-blue-600"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Pengaturan Akun
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Masuk untuk mulai belanja & jualan
                </p>
                <Button
                  onClick={() => {
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3 shadow-md"
                >
                  Masuk / Daftar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Logout */}
          {user && !isLoading && (
            <div className="p-4 border-t border-blue-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====== AUTH DIALOG (shared for both mobile & desktop) ====== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLogin ? "Login" : "Create Account"}</DialogTitle>
          </DialogHeader>

          {isLogin ? (
            <>
              <LoginForm onSuccess={() => setOpen(false)} />
              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-blue-500 cursor-pointer hover:underline font-medium"
                >
                  Register
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
