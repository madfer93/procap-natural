"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Scissors, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  RotateCcw
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  { label: "Precios de Prótesis", icon: DollarSign, query: "¿Cuáles son los precios de los sistemas capilares y cuál es el más recomendado?" },
  { label: "¿Resiste deporte y agua?", icon: ShieldCheck, query: "¿La prótesis capilar resiste sudor del gimnasio, piscina y casco de moto?" },
  { label: "Mantenimiento ($75k)", icon: Scissors, query: "¿En qué consiste el servicio de mantenimiento y cada cuánto se debe hacer?" },
  { label: "Sede Chicó Norte", icon: MapPin, query: "¿Dónde están ubicados en Bogotá y cómo puedo agendar una cita?" },
];

export function AiChatBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const DEFAULT_WELCOME: ChatMessage = {
    id: "welcome-1",
    role: "assistant",
    content: "¡Hola! 👋 Soy **CapilarBot**, asesor oficial de **Procap Natural**.\n\n¿En qué puedo ayudarte hoy sobre nuestras prótesis capilares indetectables, precios o citas?",
    time: "Ahora"
  };

  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME]);

  // Cargar memoria previa desde localStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("procap_capilarbot_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar historial local del chat");
    }
  }, []);

  // Guardar en localStorage cada vez que los mensajes cambian
  useEffect(() => {
    try {
      if (messages.length > 1) {
        localStorage.setItem("procap_capilarbot_history", JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  const clearChatHistory = () => {
    try {
      localStorage.removeItem("procap_capilarbot_history");
    } catch (e) {}
    setMessages([DEFAULT_WELCOME]);
  };

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content || "Disculpa, no pude procesar tu consulta en este momento.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedHistory = [...messages, userMessage, assistantMessage];
      setMessages(updatedHistory);

      // Guardar conversación en Supabase (ai_leads) en segundo plano
      try {
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_log: updatedHistory.map((m) => ({
              role: m.role,
              content: m.content,
              time: m.time
            }))
          })
        }).catch(() => {});
      } catch (e) {}
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón Flotante del Asistente IA (Lado Izquierdo Inferior) */}
      <div className="fixed bottom-6 left-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 bg-[#031C45]/95 hover:bg-[#073374] text-slate-100 border border-sky-400/40 hover:border-sky-300 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:scale-105"
            aria-label="Abrir asistente de IA CapilarBot"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/30">
              <Bot size={22} />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                <Sparkles size={12} /> CapilarBot IA
              </span>
              <span className="text-[11px] text-slate-300">Asesor 24/7 de Prótesis</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse hidden sm:block"></span>
          </button>
        )}
      </div>

      {/* Ventana / Panel del Chat de IA */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-[#031C45]/98 border border-sky-400/40 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-[#073374]/60 to-[#031C45] border-b border-sky-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
                <Bot size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">CapilarBot IA</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30">
                    Groq Fast
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> En línea • Asesor Oficial Procap
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={clearChatHistory}
                title="Reiniciar conversación y memoria"
                className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-300 flex items-center justify-center transition-colors border border-slate-700 text-xs"
                aria-label="Reiniciar conversación"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => {
              const isSecurityWarning = msg.content.includes("⚠️") || msg.content.includes("🚨");
              const isBlocked = msg.content.includes("⛔");

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isBlocked
                        ? "bg-red-500/20 border border-red-500/40 text-red-400"
                        : isSecurityWarning
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                        : "bg-sky-500/20 border border-sky-400/30 text-sky-400"
                    }`}>
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-semibold rounded-tr-none shadow-md"
                        : isBlocked
                        ? "bg-red-950/80 text-red-200 border border-red-500/50 rounded-tl-none"
                        : isSecurityWarning
                        ? "bg-amber-950/70 text-amber-200 border border-amber-500/40 rounded-tl-none"
                        : "bg-slate-900/90 text-slate-100 border border-sky-400/20 rounded-tl-none"
                    }`}
                  >
                  <div className="whitespace-pre-line space-y-1">
                    {msg.content.split('\n').map((line, lIdx) => {
                      // Parsear **negritas**
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx}>
                          {parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={pIdx} className="font-bold text-sky-300">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      msg.role === "user" ? "text-slate-950/70 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-sky-300 text-xs py-2 px-3 bg-slate-900/80 rounded-xl w-fit border border-sky-400/20">
                <Sparkles size={14} className="text-sky-400 animate-spin" />
                <span>CapilarBot está consultando el catálogo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const IconComp = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.query)}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#073374]/50 hover:bg-sky-500/20 border border-sky-400/30 hover:border-sky-400 text-[11px] text-slate-200 hover:text-sky-300 transition-colors"
                >
                  <IconComp size={12} className="text-sky-400" />
                  <span>{prompt.label}</span>
                </button>
              );
            })}
          </div>

          {/* WhatsApp Escalation Bar */}
          <div className="px-4 py-2 bg-emerald-950/40 border-t border-emerald-800/40 flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 flex items-center gap-1 font-medium">
              <MessageCircle size={13} /> ¿Prefieres atención humana?
            </span>
            <a
              href="https://wa.me/573151189795?text=¡Hola!%20Vengo%20del%20chat%20de%20IA%20y%20deseo%20hablar%20con%20un%20estilista%20humano."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline"
            >
              WhatsApp (+57 315 1189795) <ExternalLink size={11} />
            </a>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pregúntame sobre precios, citas o envíos..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md shadow-sky-400/20"
                aria-label="Enviar mensaje a CapilarBot"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
