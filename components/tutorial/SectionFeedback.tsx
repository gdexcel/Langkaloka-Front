"use client";

import { useState } from "react";

export default function SectionFeedback() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    // TODO: connect to your feedback API here
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="feedback" className="scroll-mt-16">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-700"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M18 12a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h12a2 2 0 012 2v8z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">
            Kirim Feedback
          </h2>
          <p className="text-xs text-blue-400 mt-0.5">
            Kritik & saran untuk Langkaloka
          </p>
        </div>
      </div>

      {/* Access info */}
      <div className="bg-blue-50 border border-blue-200 border-l-[3px] border-l-blue-700 rounded-xl p-3 mb-5">
        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
          Cara akses
        </p>
        <p className="text-xs text-blue-600 leading-relaxed">
          <b>Desktop:</b> Klik ikon feedback di header atas.
          <br />
          <b>Mobile:</b> Tap ☰ → pilih menu Feedback.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-2.5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis kritik atau saranmu untuk Langkaloka..."
          rows={4}
          className="w-full border-[1.5px] border-blue-100 focus:border-blue-700 outline-none rounded-xl px-3.5 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 resize-none transition-colors"
        />
        <button
          onClick={handleSend}
          className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] ${
            sent ? "bg-green-600" : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {sent ? "✓ Terima kasih!" : "Kirim Feedback →"}
        </button>
      </div>
    </section>
  );
}
