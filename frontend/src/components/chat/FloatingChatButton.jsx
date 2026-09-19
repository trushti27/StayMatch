import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

export default function FloatingChatButton({ onOpenFullChat }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "StayMatch Support",
      text: "Hi Neeraj! 👋 Looking for a PG in Ahmedabad or need help finding compatible roommates?",
      time: "Just now",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "You",
      text: input,
      time: "Just now",
      isBot: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "StayMatch AI",
          text: "I've noted that! You can check compatible roommate matches or tap Find PG to filter rooms in Gota, Vastrapur, or Satellite.",
          time: "Just now",
          isBot: true,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded chat popup */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-3xl border border-gray-100 bg-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200 overflow-hidden flex flex-col h-[420px]">
          {/* Header */}
          <div className="bg-[#5b3bf5] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">StayMatch Assistant</h4>
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online · Instant Help
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fe]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    m.isBot
                      ? "rounded-tl-xs bg-white text-gray-800 shadow-xs border border-gray-100"
                      : "rounded-tr-xs bg-[#5b3bf5] text-white shadow-xs"
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block mt-1 text-[10px] text-right ${
                      m.isBot ? "text-gray-400" : "text-white/70"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input box */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about PGs or roommates..."
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 focus:border-[#5b3bf5] focus:ring-1 focus:ring-[#5b3bf5]"
            />
            <button
              type="submit"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#5b3bf5] text-white transition hover:bg-[#4a2ce0]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat Support"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5b3bf5] text-white shadow-xl shadow-[#5b3bf5]/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
