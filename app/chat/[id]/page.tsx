// langkaloka-v1\app\chat\[id]\page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Header } from "@/components/views/Header";
import Pusher from "pusher-js";
import Link from "next/link";
import { toast } from "sonner";

/* ─────────────────────────────────────────
   Sticky Product Bar
───────────────────────────────────────── */
function StickyProduct({
  product,
  scrollRef,
}: {
  product: any;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [mini, setMini] = useState(false);
  const lastY = useRef(0);
  // debounce flag supaya tidak flicker saat scroll cepat
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !product) return;
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const y = el.scrollTop;
        if (y > lastY.current && y > 40) setMini(true);
        else if (y < lastY.current - 10) setMini(false);
        lastY.current = y;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [product]);

  if (!product) return null;

  const price = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="flex items-center gap-3 px-4 border-b border-slate-100 cursor-pointer overflow-hidden bg-white"
        style={{
          // Transisi height via style langsung — lebih stabil dari class toggle
          height: mini ? 46 : 66,
          transition: "height 0.22s ease, box-shadow 0.22s ease",
          boxShadow: mini ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
          willChange: "height",
        }}
      >
        {/* Image */}
        <div
          className="shrink-0 rounded-xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center"
          style={{
            width: mini ? 28 : 40,
            height: mini ? 28 : 40,
            fontSize: mini ? 13 : 18,
            transition: "width 0.22s ease, height 0.22s ease",
            willChange: "width, height",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            "📦"
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Label "PRODUK" — fade out saat mini, jangan conditional render */}
          <p
            className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest"
            style={{
              maxHeight: mini ? 0 : 16,
              opacity: mini ? 0 : 1,
              marginBottom: mini ? 0 : 2,
              overflow: "hidden",
              transition:
                "max-height 0.18s ease, opacity 0.15s ease, margin-bottom 0.18s ease",
            }}
          >
            Produk
          </p>
          <p
            className="font-semibold text-slate-800 truncate leading-tight"
            style={{
              fontSize: mini ? 12 : 13,
              transition: "font-size 0.18s ease",
            }}
          >
            {product.name}
          </p>
          <p className="text-xs font-semibold text-blue-600 truncate">
            {price}
          </p>
        </div>

        {/* Chevron */}
        <div
          className="shrink-0 rounded-full bg-blue-50 flex items-center justify-center"
          style={{
            width: mini ? 20 : 24,
            height: mini ? 20 : 24,
            transition: "width 0.22s ease, height 0.22s ease",
          }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   Typing Dots
───────────────────────────────────────── */
function TypingDots({ avatar }: { avatar: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">
        {avatar}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1 items-center">
        {[0, 180, 360].map((d) => (
          <span
            key={d}
            className="inline-block w-1.5 h-1.5 rounded-full bg-blue-300"
            style={{
              animation: "tdot 1.2s ease-in-out infinite",
              animationDelay: `${d}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Message Bubble
───────────────────────────────────────── */
function Bubble({
  msg,
  isMe,
  avatar,
  storeImage,
}: {
  msg: any;
  isMe: boolean;
  avatar: string;
  storeImage: string | null;
}) {
  const time = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
      {/* Avatar lawan */}
      {!isMe && (
        <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mb-5">
          {storeImage ? ( // ← ganti ini
            <img
              src={storeImage}
              alt={avatar}
              className="w-full h-full object-cover"
            />
          ) : (
            avatar
          )}
        </div>
      )}

      <div className="max-w-[70%]">
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isMe
              ? "bg-blue-600 text-white rounded-2xl rounded-br-[4px]"
              : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-[4px]"
          }`}
        >
          {msg.text}
        </div>

        {/* Meta */}
        <div
          className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end pr-1" : "justify-start pl-1"}`}
        >
          <span className="text-[10px] text-slate-400">{time}</span>
          {isMe && (
            <span
              className={`text-[10px] ${msg.readAt ? "text-green-400" : "text-slate-400"}`}
            >
              {msg.readAt ? "✔✔" : "✔"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [chatMeta, setChatMeta] = useState<{
    storeName: string;
    storeImage: string | null;
    otherUserId: string | null;
    isOnline: boolean;
    storeId: string | null;
  }>({
    storeName: "",
    storeImage: null,
    otherUserId: null,
    isOnline: false,
    storeId: null,
  });

  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeat = useRef<NodeJS.Timeout | null>(null);
  const onlinePoll = useRef<NodeJS.Timeout | null>(null);

  const myId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

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

  const startOnlinePoll = (uid: string) => {
    const check = async () => {
      try {
        const r = await fetch(`/api/user/online?userId=${uid}`);
        const d = await r.json();
        setChatMeta((p) => ({ ...p, isOnline: d.online ?? false }));
      } catch (_) {}
    };
    check();
    onlinePoll.current = setInterval(check, 15_000);
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${chatId}`);
      setMessages(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMeta = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = (res.data as any[]).find((c) => c.id === chatId);
      if (found) {
        setChatMeta({
          storeName: found.storeName ?? found.otherUserName ?? "",
          storeImage: found.storeImage ?? null,
          otherUserId: found.otherUserId ?? null,
          isOnline: found.isOnline ?? false,
          storeId: found.storeId ?? null,
        });
        if (found.otherUserId) startOnlinePoll(found.otherUserId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchMeta();
    ping();
    heartbeat.current = setInterval(ping, 20_000);
    return () => {
      if (heartbeat.current) clearInterval(heartbeat.current);
      if (onlinePoll.current) clearInterval(onlinePoll.current);
    };
  }, [chatId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`/api/chat/${chatId}/read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [chatId]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const ch = pusher.subscribe(`chat-${chatId}`);

    ch.bind("new-message", (data: any) => {
      if (data.type === "product") {
        fetchMessages();
        return;
      }
      setMessages((p) => [...p, data]);
      const id = localStorage.getItem("userId");
      if (data.senderId !== id) {
        const token = localStorage.getItem("token");
        if (token)
          fetch(`/api/chat/${chatId}/read`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
      }
    });

    ch.bind("read", (data: any) => {
      const id = localStorage.getItem("userId");
      if (data.readerId === id) return;
      setMessages((p) =>
        p.map((m) =>
          m.id === data.messageId ? { ...m, readAt: data.readAt } : m,
        ),
      );
    });

    ch.bind("typing", (data: any) => {
      const id = localStorage.getItem("userId");
      if (data.userId === id) return;
      setIsTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
    });

    return () => {
      ch.unbind_all();
      ch.unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login dulu");
      return;
    }
    setSending(true);
    try {
      await axios.post(
        `/api/chat/${chatId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setText("");
      inputRef.current?.focus();
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = async (val: string) => {
    setText(val);
    const token = localStorage.getItem("token");
    if (!token || typingTimer.current) return;
    typingTimer.current = setTimeout(() => {
      typingTimer.current = null;
    }, 1000);
    try {
      await fetch("/api/chat/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId }),
      });
    } catch (_) {}
  };

  /* derived */
  const pinnedProduct =
    messages.find((m) => m.type === "product")?.product ?? null;
  const chatMessages = messages.filter((m) => m.type !== "product");

  const grouped = (() => {
    const groups: { label: string; items: any[] }[] = [];
    chatMessages.forEach((msg) => {
      const d = msg.createdAt ? new Date(msg.createdAt) : new Date();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      let label = d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      if (d.toDateString() === today.toDateString()) label = "Hari ini";
      else if (d.toDateString() === yesterday.toDateString()) label = "Kemarin";
      const last = groups[groups.length - 1];
      if (last?.label === label) last.items.push(msg);
      else groups.push({ label, items: [msg] });
    });
    return groups;
  })();

  const { storeName, storeImage, isOnline, storeId } = chatMeta;
  const initials =
    storeName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase() || "?";

  return (
    <main className="h-svh flex flex-col bg-slate-50 overflow-hidden">
      <style>{`
        @keyframes tdot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-4px);opacity:1} }
        @keyframes msgIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        .msg-in { animation: msgIn 0.16s ease forwards; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <Header />

      {/* ── Navbar ── */}
      <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-3 shrink-0">
        {/* Back */}
        <button
          onClick={() => router.push("/chat")}
          className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 active:bg-slate-100 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Avatar */}
        <div
          className={`relative shrink-0 ${storeId ? "cursor-pointer" : ""}`}
          onClick={() => storeId && router.push(`/store/${storeId}`)}
        >
          {storeImage ? (
            <img
              src={storeImage}
              alt={storeName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">
              {initials}
            </div>
          )}
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors ${
              isOnline ? "bg-green-400" : "bg-slate-300"
            }`}
          />
        </div>

        {/* Name + status */}
        <div
          className={`flex-1 min-w-0 ${storeId ? "cursor-pointer" : ""}`}
          onClick={() => storeId && router.push(`/store/${storeId}`)}
        >
          <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
            {storeName || "..."}
          </p>
          <p
            className={`text-[11px] font-medium mt-0.5 ${isOnline ? "text-green-500" : "text-slate-400"}`}
          >
            {isOnline ? "Online sekarang" : "Offline"}
          </p>
        </div>
      </div>

      {/* ── Sticky Product ── */}
      <StickyProduct product={pinnedProduct} scrollRef={scrollRef} />

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-3 pb-2 flex flex-col gap-1"
      >
        {/* Empty state */}
        {grouped.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 pt-12 text-center">
            <div className="w-13 h-13 rounded-2xl bg-blue-50 flex items-center justify-center p-3 mb-1">
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
              Belum ada pesan
            </p>
            <p className="text-xs text-slate-400">Mulai percakapan sekarang</p>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.label}>
            {/* Date divider */}
            <div className="flex justify-center my-3">
              <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 rounded-full px-3 py-1">
                {group.label}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {group.items.map((msg, i) => (
                <div key={`${msg.id}-${i}`} className="msg-in">
                  <Bubble
                    msg={msg}
                    isMe={msg.senderId === myId}
                    avatar={initials}
                    storeImage={storeImage}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="mt-1">
            <TypingDots avatar={initials} />
          </div>
        )}
        <div className="h-1" />
      </div>

      {/* ── Input Bar ── */}
      <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-3 shrink-0">
        {/* Input */}
        <div
          className={`flex-1 flex items-center gap-2 h-11 px-4 rounded-full bg-slate-50 border transition-all ${inputFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ketik pesan..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          {text && (
            <button
              onClick={() => setText("")}
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

        {/* Send */}
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
            text.trim()
              ? "bg-blue-600 shadow-sm shadow-blue-200"
              : "bg-slate-200"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke={text.trim() ? "white" : "#94A3B8"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke={text.trim() ? "white" : "#94A3B8"}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}
