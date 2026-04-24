// langkaloka-v1\app\chat\page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Header } from "@/components/views/Header";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";

export default function ChatListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const ping = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch("/api/user/online", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (_) {}
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchChats();
    ping();
    heartbeatRef.current = setInterval(ping, 20_000);

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const ch = pusher.subscribe("chat-list");
    ch.bind("update", () => fetchChats());
    ch.bind("typing", (data: any) => {
      const myId = localStorage.getItem("userId");
      if (data.userId === myId) return;
      setTypingUsers((p) => ({ ...p, [data.chatId]: true }));
      setTimeout(
        () => setTypingUsers((p) => ({ ...p, [data.chatId]: false })),
        2000,
      );
    });

    return () => {
      ch.unbind_all();
      ch.unsubscribe();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  const allFiltered = chats.filter((c) =>
    (c.storeName || "").toLowerCase().includes(search.toLowerCase()),
  );
  const filtered =
    filter === "unread"
      ? allFiltered.filter((c) => (c.unreadCount ?? 0) > 0)
      : allFiltered;

  const totalUnread = chats.reduce((s, c) => s + (c.unreadCount ?? 0), 0);
  const unreadChatCount = chats.filter((c) => (c.unreadCount ?? 0) > 0).length;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();

  const formatTime = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    const now = new Date();
    if (date.toDateString() === now.toDateString())
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    const diff = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
    if (diff === 1) return "Kemarin";
    return date.toLocaleDateString("id-ID", { weekday: "short" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-white font-sans">
      <style>{`
        @keyframes tdot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-3px);opacity:1} }
        @keyframes popIn { from{transform:scale(0)} to{transform:scale(1)} }
        .typing-dot { animation: tdot 1.2s ease-in-out infinite; }
        .badge-pop { animation: popIn .2s cubic-bezier(0.34,1.56,0.64,1); }
        .chat-row:active { background-color: #F8FAFF !important; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <Header />

      {/* ── Top Section ── */}
      <div className="px-5 pt-5 pb-0 bg-white">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">
              Pesan
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalUnread > 0
                ? `${totalUnread} pesan belum dibaca`
                : `${chats.length} percakapan`}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#64748B" strokeWidth="2" />
              <path
                d="M16.5 16.5 21 21"
                stroke="#64748B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Search */}
        <div
          className={`flex items-center gap-2 h-11 px-4 rounded-xl border bg-slate-50 transition-all ${searchFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke={searchFocused ? "#3B82F6" : "#94A3B8"}
              strokeWidth="2"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke={searchFocused ? "#3B82F6" : "#94A3B8"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Cari toko atau percakapan..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-3 mb-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${filter === "all" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${filter === "unread" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
          >
            Belum Dibaca
            {unreadChatCount > 0 && (
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-px ${filter === "unread" ? "bg-white/25 text-white" : "bg-blue-600 text-white"}`}
              >
                {unreadChatCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mt-2" />

      {/* ── List ── */}
      <div className="flex-1">
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 gap-2 text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="#3B82F6"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {search
                ? "Tidak ada hasil"
                : filter === "unread"
                  ? "Semua sudah dibaca 🎉"
                  : "Belum ada percakapan"}
            </p>
            <p className="text-xs text-slate-400">
              {search
                ? "Coba kata kunci lain"
                : filter === "unread"
                  ? "Kamu sudah up to date"
                  : "Mulai chat dari halaman produk"}
            </p>
          </div>
        )}

        {filtered.map((chat, idx) => {
          const name = chat.storeName ?? "Toko";
          const img = chat.storeImage ?? null;
          const ini = getInitials(name);
          const typing = typingUsers[chat.id];
          const hasUnread = (chat.unreadCount ?? 0) > 0;
          const online = chat.isOnline === true;

          return (
            <div
              key={`${chat.id}-${idx}`}
              className="chat-row flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 cursor-pointer active:bg-blue-50 transition-colors"
              style={{ backgroundColor: hasUnread ? "#FAFCFF" : "white" }}
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                {img ? (
                  <img
                    src={img}
                    alt={name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                    {ini}
                  </div>
                )}
                {online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p
                    className={`text-sm truncate flex-1 mr-2 ${hasUnread ? "font-bold text-slate-800" : "font-semibold text-slate-700"}`}
                  >
                    {name}
                  </p>
                  <p
                    className={`text-[11px] shrink-0 ${hasUnread ? "text-blue-600 font-semibold" : "text-slate-400"}`}
                  >
                    {formatTime(chat.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs truncate flex-1 text-slate-400">
                    {typing ? (
                      <span className="flex items-center gap-1.5 text-green-500">
                        <span className="flex gap-0.5 items-end">
                          {[0, 150, 300].map((d) => (
                            <span
                              key={d}
                              className="typing-dot inline-block w-1 h-1 rounded-full bg-green-400"
                              style={{ animationDelay: `${d}ms` }}
                            />
                          ))}
                        </span>
                        <span className="font-medium">mengetik...</span>
                      </span>
                    ) : (
                      <span
                        className={
                          hasUnread ? "font-medium text-slate-500" : ""
                        }
                      >
                        {chat.lastMessage ?? "Belum ada pesan"}
                      </span>
                    )}
                  </p>
                  {hasUnread && (
                    <span className="badge-pop shrink-0 bg-blue-600 text-white text-[10px] font-bold rounded-full px-1.5 py-px min-w-[18px] text-center">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Chevron */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 opacity-30"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </main>
  );
}
