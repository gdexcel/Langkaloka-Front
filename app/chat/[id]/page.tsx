"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Header } from "@/components/views/Header";
import Pusher from "pusher-js";
import Link from "next/link"; // 🔥 TAMBAH

// 🔥 TAMBAH: komponen product card bubble
function ProductCard({ product, isMe }: { product: any; isMe: boolean }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div
        className={`
          flex gap-3 p-3 rounded-2xl max-w-25 border cursor-pointer transition hover:opacity-80
          ${isMe ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
        `}
      >
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg flex shrink-0"
          />
        )}
        <div className="flex flex-col justify-center min-w-0">
          <p
            className={`text-xs font-semibold line-clamp-2 ${isMe ? "text-white" : "text-gray-900"}`}
          >
            {product.name}
          </p>
          <p
            className={`text-xs mt-1 font-bold ${isMe ? "text-gray-300" : "text-gray-700"}`}
          >
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // 🔥 FETCH MESSAGE
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat/${chatId}`);
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  // 🔥 MARK AS READ (SAAT MASUK ROOM)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/chat/${chatId}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [chatId]);

  // 🔥 PUSHER REALTIME
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);

    // ✅ MESSAGE MASUK
    channel.bind("new-message", (data: any) => {
      // 🔥 TAMBAH: kalau message type product dari pusher, fetch ulang
      // supaya data product (nama, foto, harga) ikut ke-load
      if (data.type === "product") {
        fetchMessages();
        return;
      }

      setMessages((prev) => [...prev, data]);

      const myId = localStorage.getItem("userId");
      if (data.senderId === myId) return;

      const token = localStorage.getItem("token");
      if (token) {
        fetch(`/api/chat/${chatId}/read`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    });

    // ✅ READ RECEIPT (tidak berubah)
    channel.bind("read", (data: any) => {
      const myId = localStorage.getItem("userId");
      if (data.readerId === myId) return;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            return { ...msg, readAt: data.readAt };
          }
          return msg;
        }),
      );
    });

    // ✅ TYPING (tidak berubah)
    channel.bind("typing", (data: any) => {
      const myId = localStorage.getItem("userId");
      if (data.userId === myId) return;

      setIsTyping(true);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  // 🔥 AUTO SCROLL (tidak berubah)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // 🔥 SEND MESSAGE (tidak berubah)
  const sendMessage = async () => {
    if (!text.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login dulu");
      return;
    }

    try {
      await axios.post(
        `/api/chat/${chatId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 TYPING TRIGGER (tidak berubah)
  const handleTyping = async (value: string) => {
    setText(value);

    const token = localStorage.getItem("token");
    if (!token) return;

    if (typingTimeout.current) return;

    typingTimeout.current = setTimeout(() => {
      typingTimeout.current = null;
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Chat</h1>

        {/* 🔥 TAMBAH: Product card pinned di atas, di luar scroll area */}
        {messages.find((msg) => msg.type === "product" && msg.product) && (
          <div className="border border-gray-200 rounded-2xl bg-white shadow-sm">
            <Link
              href={`/product/${messages.find((msg) => msg.type === "product")?.product?.id}`}
            >
              <div className="flex gap-3 p-3 cursor-pointer hover:bg-gray-50 transition rounded-2xl">
                {messages.find((msg) => msg.type === "product")?.product
                  ?.image && (
                  <img
                    src={
                      messages.find((msg) => msg.type === "product")?.product
                        ?.image
                    }
                    alt={
                      messages.find((msg) => msg.type === "product")?.product
                        ?.name
                    }
                    className="w-16 h-16 object-cover rounded-lg flex shrink-0"
                  />
                )}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">Produk</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {
                      messages.find((msg) => msg.type === "product")?.product
                        ?.name
                    }
                  </p>
                  <p className="text-sm font-bold text-gray-700 mt-1">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(
                      messages.find((msg) => msg.type === "product")?.product
                        ?.price ?? 0,
                    )}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 🔥 MESSAGE LIST — product bubble di-filter, tidak ikut render di sini */}
        <div
          ref={containerRef}
          className="border rounded-lg p-4 h-100 overflow-y-auto flex flex-col gap-2"
        >
          {messages
            .filter((msg) => msg.type !== "product") // 🔥 skip product message di scroll area
            .map((msg) => {
              const myId = localStorage.getItem("userId");
              const isMe = msg.senderId === myId;

              return (
                <div
                  key={`${msg.id}-${msg.createdAt}`}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                    px-4 py-2 rounded-2xl max-w-[70%] text-sm flex items-center gap-1
                    ${
                      isMe
                        ? "bg-black text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }
                  `}
                  >
                    <span>{msg.text}</span>
                    {isMe && (
                      <span className="text-xs text-gray-300 ml-1">
                        {msg.readAt ? "✔✔" : "✔"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          {isTyping && (
            <p className="text-sm text-gray-400 italic">Sedang mengetik...</p>
          )}
        </div>

        {/* INPUT (tidak berubah) */}
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Ketik pesan..."
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 rounded"
          >
            Kirim
          </button>
        </div>
      </div>
    </main>
  );
}
