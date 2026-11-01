"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  source?: string;
  vectors?: string[];
  recommendedAction?: string;
}

const DEFAULT_GREETING: ChatMessage = {
  id: "greeting",
  sender: "assistant",
  text: `Halo! Saya **TRASP AI Forensic Copilot** yang terhubung langsung dengan **Google AI Studio (Gemini)**.

Kamu bisa berdiskusi dan berkonsultasi dengan saya layaknya rekan analis keamanan siber ("pair analyst"):
- 🔍 **Analisis Kasus:** Tempel teks chat WhatsApp atau SMS mencurigakan untuk dibedah.
- 🚨 **Mitigasi Darurat:** Minta panduan *Golden Time (15-30 Menit)* jika telanjur klik link/transfer.
- ⚖️ **Kajian Yuridis:** Tanyakan jerat hukum *Pasal 378 KUHP* dan *UU ITE No. 1/2024*.
- 🏛️ **Kanal Otoritas:** Prosedur aduan ke *IASC OJK (157)* atau *Patroli Siber Polri*.

Ada sampel atau pertanyaan yang ingin kita pelajari bersama?`,
  timestamp: "Baru saja",
  source: "gemini-ai",
  vectors: ["AI Forensik Studio", "Regulasi OJK & Polri", "UU ITE 2024"],
};

const SUGGESTED_PROMPTS = [
  "Bagaimana cara membedakan file APK kurir asli vs trojan perbankan?",
  "Jika saya sudah telanjur transfer uang ke penipu, apa langkah 15 menit pertama?",
  "Apa bunyi pasal dan ancaman hukuman UU ITE untuk penipuan online?",
  "Tolong analisis pesan ini: 'Selamat akun BRI Anda menang undian 50jt, klik bri-hadiah.my.id'",
];

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_GREETING]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/trasp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          mode: "assistant",
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: "a-" + Date.now(),
        sender: "assistant",
        text: data.assistantResponse || "Analisis forensik telah selesai dilakukan.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source || "gemini-ai",
        vectors: data.detectedVectors || ["Analisis Forensik"],
        recommendedAction: data.recommendedAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "assistant",
          text: "Mohon maaf, sistem AI mengalami kendala koneksi sejenak. Namun sebagai panduan forensik: jangan pernah klik tautan tidak resmi atau menginstal file .apk di luar Google Play Store.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          source: "offline-guard",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-full shadow-2xl hover:bg-primary/90 transition-all transform hover:scale-105 border-2 border-primary-foreground/20"
            title="Tanya Asisten AI Forensik TRASP"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="text-xs tracking-wider uppercase font-mono">
              Asisten Forensik AI
            </span>
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 uppercase font-mono bg-background/20 text-foreground hidden sm:inline-block">
              Gemini Studio
            </Badge>
          </button>
        )}
      </div>

      {/* Slide-Up / Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[94vw] max-w-[460px] h-[600px] max-h-[85vh] flex flex-col bg-card border-2 border-border shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/80 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold font-mono tracking-wide">
                    TRASP AI FORENSIC COPILOT
                  </h3>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono">
                    LIVE AI
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Google AI Studio (Gemini 3.6 Flash) & Satgas IASC OJK
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                onClick={() => setMessages([DEFAULT_GREETING])}
                title="Reset Percakapan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-background/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "assistant" && (
                  <div className="w-6 h-6 rounded bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-0.5 border border-primary/20">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 space-y-2 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted/60 border border-border text-foreground"
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-xs dark:prose-invert">
                    {m.text}
                  </div>

                  {m.recommendedAction && (
                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{m.recommendedAction}</span>
                    </div>
                  )}

                  {m.vectors && m.vectors.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
                      {m.vectors.map((v, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 bg-background/80 rounded border border-border/60 text-muted-foreground font-mono"
                        >
                          #{v}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/80 font-mono pt-0.5">
                    <span>{m.source ? `via ${m.source}` : ""}</span>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
                {m.sender === "user" && (
                  <div className="w-6 h-6 rounded bg-muted flex-shrink-0 flex items-center justify-center text-foreground mt-0.5 border border-border">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-muted-foreground text-xs italic p-2 bg-muted/40 rounded border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Gemini 3.6 Flash sedang mempelajari dan menganalisis...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggested Chips */}
          <div className="p-2 bg-muted/30 border-t border-border flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-muted-foreground font-mono uppercase text-[9px] flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" /> Contoh:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2 py-1 bg-background border border-border hover:border-primary rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {prompt.length > 35 ? prompt.slice(0, 35) + "..." : prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-muted/60 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-1.5 items-end"
            >
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Tanya asisten atau tempel pesan penipuan di sini..."
                className="text-xs resize-none min-h-[44px] max-h-[88px] bg-background border-border"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                aria-label="Kirim Pesan"
                disabled={!inputText.trim() || isLoading}
                className="h-[44px] px-3 font-semibold uppercase text-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
