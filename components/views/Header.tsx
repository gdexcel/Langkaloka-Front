'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import SignupPage from './Signup';
import { LoginForm } from './fragments/LoginForm';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Pusher from 'pusher-js';
import {
  Store,
  Heart,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Search,
  MessageSquareText,
} from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastEventRef = useRef<string | null>(null);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (pathname !== '/search') return;
    const q = searchParams.get('q') || '';
    setSearchQuery((prev) => (prev === q ? prev : q));
  }, [pathname, searchParams]);

  useEffect(() => {
    audioRef.current = new Audio('/notif.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    const unlock = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {});
    };
    document.addEventListener('click', unlock, { once: true });
    return () => document.removeEventListener('click', unlock);
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const sendPing = () => {
      fetch('/api/user/online', {
        method: 'POST',
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

    const channel = pusher.subscribe('chat-list');

    const onChatListUpdate = (data: ChatListUpdateEvent) => {
      const myId = localStorage.getItem('userId');
      if (!myId) return;

      const senderId = String(data.senderId ?? '');
      const buyerId = String(data.buyerId ?? '');
      const sellerId = String(data.sellerId ?? '');
      const chatId = String(data.chatId ?? '');
      const text = String(data.text ?? '');

      if (!chatId || !text) return;
      if (senderId === myId) return;

      const isParticipant = buyerId === myId || sellerId === myId;
      if (!isParticipant) return;

      const currentChatId = window.location.pathname.split('/chat/')[1];
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

    channel.bind('update', onChatListUpdate);

    return () => {
      channel.unbind('update', onChatListUpdate);
      pusher.unsubscribe('chat-list');
      pusher.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setMobileMenuOpen(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setMobileMenuOpen(false);
  };

  const userInitial = (user?.name || user?.email)?.[0]?.toUpperCase() || 'U';

  const navItems: NavItem[] = [
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    {
      label: 'Chat',
      path: '/chat',
      icon: MessageCircle,
      startsWith: true,
      onClick: () => setNotif(0),
      badge: notif,
    },
    { label: 'Jualan', path: '/store-panel', icon: Store, startsWith: true },
    { label: 'Feedback', path: '/feedback', icon: MessageSquareText },
  ];

  const isActive = (item: NavItem) =>
    item.startsWith ? pathname.startsWith(item.path) : pathname === item.path;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-6">
          <button
            onClick={() => router.push('/')}
            className="group flex shrink-0 items-center gap-2.5 cursor-pointer"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-2 ring-blue-100 transition-all duration-200 group-hover:ring-blue-300">
              <Image
                src="/langkaloka-logo.png"
                alt="LangkaLoka"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="hidden text-2xl font-bold tracking-tight text-gray-900 sm:block">
              LangkaLoka
            </span>
          </button>

          <form
            onSubmit={handleSearch}
            className="hidden w-full max-w-xl justify-self-center md:flex"
          >
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang preloved..."
                className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-24 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                Cari
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            {isLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <>
                <div className="hidden items-center gap-1 rounded-full bg-white p-1 md:flex">
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
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer ${
                          active
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={item.label}
                      >
                        <Icon className="h-6 w-6" />
                        {item.badge && item.badge > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => router.push('/account')}
                  className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[13px] font-bold text-white">
                    {userInitial}
                  </div>
                  <span className="hidden max-w-[100px] truncate text-[13px] lg:block">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-red-500 md:flex cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLogin(true);
                  setOpen(true);
                }}
                className="h-9 rounded-full bg-blue-600 px-4 text-[13px] font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
              >
                Login
              </button>
            )}

            <button
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-gray-100 md:hidden cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-gray-600" />
              ) : (
                <Menu className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-dvh w-72 border-l border-gray-100 bg-white shadow-2xl transition-transform duration-200 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
          <span className="text-[13px] font-semibold text-gray-800">Menu</span>
          <button
            className="rounded-full p-1.5 hover:bg-gray-100 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex h-[calc(100%-3.5rem)] flex-col">
          <form onSubmit={handleSearch} className="border-b border-gray-50 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barang..."
                className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </form>

          <div className="flex-1 overflow-y-auto p-3">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => {
                    router.push('/account');
                    setMobileMenuOpen(false);
                  }}
                  className="mb-3 flex w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 transition hover:bg-blue-100 cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {userInitial}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-[13px] font-semibold text-gray-900">
                      {user.name || user.email?.split('@')[0]}
                    </p>
                    <p className="truncate text-[11px] text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </button>

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
                      className={`mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition cursor-pointer ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="space-y-3 p-2">
                <p className="text-[13px] text-gray-500">
                  Masuk untuk mulai belanja dan jualan.
                </p>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl border border-gray-200 py-2.5 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {user && !isLoading && (
            <div className="border-t border-gray-100 p-3">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLogin ? 'Masuk' : 'Buat Akun'}</DialogTitle>
          </DialogHeader>
          {isLogin ? (
            <>
              <LoginForm onSuccess={() => setOpen(false)} />
              <p className="text-center text-[13px] text-gray-500">
                Belum punya akun?{' '}
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
