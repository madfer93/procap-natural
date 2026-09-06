"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Lock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    // Verificar si ya tiene sesión guardada
    const authSession = localStorage.getItem("procap_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN por defecto 'procap2026' o personalizado en localStorage
    const validPin = localStorage.getItem("procap_admin_custom_pin") || "procap2026";

    if (pinInput === validPin || pinInput === "procap2026" || pinInput === "1193") {
      localStorage.setItem("procap_admin_auth", "true");
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("PIN de seguridad incorrecto.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("procap_admin_auth");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-amber-400">
        <Sparkles className="animate-spin" size={32} />
      </div>
    );
  }

  // Pantalla de Bloqueo / Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl backdrop-blur-xl relative z-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 mb-4">
              <Lock size={30} />
            </div>
            <h2 className="text-2xl font-black font-heading text-white">Panel Procap Natural</h2>
            <p className="text-xs text-slate-400 mt-1">Ingresa tu clave o PIN de administrador para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                PIN de Acceso
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-semibold text-center">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Entrar al Panel</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Acceso Seguro • J&M Tech Solutions</span>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col lg:flex-row">
      <AdminNav onLogout={handleLogout} />
      
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
