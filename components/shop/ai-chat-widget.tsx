"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  Minimize2,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Truck,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: "msg-init",
  role: "assistant",
  content: `Assalam-o-Alaikum! 🌟 Welcome to **BaharSe Foreign Imports**.

Main aap ka AI Sales & Support Concierge hoon. Aap mujh se:
• **Original Dubai Saffron & Spices**
• **Factory-Sealed Perfumes & Attars**
• **USA & UK Health Supplements**
• **JazzCash / EasyPaisa / Bank Advance Payment Guide**
• **Order Tracking & Nationwide Delivery (TCS/Leopards)**

kisi bhi cheez ke baray mein pooch saktay hain! How can I assist you today?`,
  provider: "concierge",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const SUGGESTIONS = [
  "🌟 Saffron & Spices rates?",
  "💎 Perfumes original hain?",
  "💳 Advance Payment details?",
  "🚚 Delivery time & rates?",
  "📦 Order track kaisay karun?",
];

export function AiChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!mounted) {
    return null;
  }

  const handleSendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            provider: data.provider,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setActiveProvider(data.provider);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "assistant",
            content:
              data.fallback ||
              "Shukriya! Humare paas 100% original Dubai & European products hain. Advance payment JazzCash/EasyPaisa ke zariye ki jaati hai. Mazeed maloomat ke liye hamara [Catalog](/shop) ya [Track Order](/track-order) check karein.",
            provider: "offline-knowledge-base",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "Network error. Aap hamari [Shop](/shop) browse kar saktay hain ya checkout par JazzCash / EasyPaisa / Bank Transfer se advance order place kar saktay hain!",
          provider: "offline-fallback",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Helper to format basic markdown (bold, links, lists) safely
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Check for bullet point line
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
      const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, "") : line;

      // Parse bold **text** and markdown links [text](url)
      const parts = [];
      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }

        const token = match[0];
        if (token.startsWith("**") && token.endsWith("**")) {
          parts.push(
            <strong key={`b-${match.index}`} className="font-bold text-navy-950">
              {token.slice(2, -2)}
            </strong>
          );
        } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
          const split = token.indexOf("](");
          const linkText = token.slice(1, split);
          const linkUrl = token.slice(split + 2, -1);
          parts.push(
            <Link
              key={`link-${match.index}`}
              href={linkUrl}
              className="text-gold-700 underline font-semibold hover:text-gold-800 inline-flex items-center gap-0.5"
            >
              {linkText}
            </Link>
          );
        }

        lastIndex = match.index + token.length;
      }

      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 my-1 pl-1">
            <span className="text-gold-600 font-bold">•</span>
            <div className="flex-1">{parts}</div>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={`${lineIdx > 0 ? "mt-1.5" : ""}`}>
          {parts.length > 0 ? parts : "\u00A0"}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open BaharSe AI Chat Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-2 border-gold-500/60 shadow-2xl hover:border-gold-400 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {/* Animated Gold Ring Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold-500/30 to-amber-500/30 blur-sm group-hover:opacity-100 opacity-60 transition duration-500" />

          <div className="relative flex items-center gap-2">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center text-navy-950 shadow-md">
                <Sparkles className="w-4 h-4 fill-navy-950" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-950 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-950 rounded-full" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                BaharSe AI <span className="text-[10px] text-gold-400 font-normal">Online</span>
              </div>
              <div className="text-[10px] text-slate-300">Gemini & Grok Assistant</div>
            </div>
          </div>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-4 flex items-center justify-between border-b border-gold-500/30 relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center text-navy-950 shadow-md">
                  <Bot className="w-5 h-5 text-navy-950" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-navy-950 rounded-full" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-tight font-serif">
                  BaharSe AI Concierge
                  <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-semibold">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Powered by Gemini & Grok • 24/7 Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-navy-900/5 px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Genuine Imports • Advance Pay Only
            </span>
            <Link
              href="/track-order"
              className="text-gold-700 hover:underline font-bold flex items-center gap-0.5"
            >
              Track Order <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-navy-950 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                  }`}
                >
                  {renderFormattedText(msg.content)}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.provider && msg.provider !== "concierge" && (
                    <span className="text-slate-400 font-mono">
                      • {msg.provider === "gemini" ? "Google Gemini" : msg.provider === "grok" ? "xAI Grok" : "Direct Knowledge"}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1.5 text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-[11px] text-slate-400 ml-1 font-medium">BaharSe AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {SUGGESTIONS.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sugg)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-300 text-slate-700 border border-slate-200 transition-colors shrink-0 disabled:opacity-50"
              >
                {sugg}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Puchiye koi bhi sawal (Roman Urdu / English)..."
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:bg-slate-200 disabled:text-slate-400 text-navy-950 font-bold transition-colors shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
