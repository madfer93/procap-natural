"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { supabase } from "@/lib/supabase";
import { Lock, ShieldCheck, ArrowRight, Sparkles, Mail, KeyRound, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Verificar sesión existente en Supabase Auth
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (e) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // 2. Escuchar cambios de estado de autenticación en tiempo real
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Verificar Rate Limit del servidor antes de procesar
      const checkRes = await fetch("/api/admin/auth-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" })
      });
      const checkData = await checkRes.json();

      if (checkData.allowed === false) {
        setError(`Acceso bloqueado por seguridad: has superado el límite de intentos fallidos. Intenta nuevamente en ${checkData.lockedMinutesRemaining || 15} minutos.`);
        setLoading(false);
        return;
      }

      // 2. Intentar autenticación con Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        // Registrar intento fallido en el servidor
        const failRes = await fetch("/api/admin/auth-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "failed" })
        });
        const failData = await failRes.json();

        if (failData.locked) {
          setError(`Acceso bloqueado temporalmente por 15 minutos debido a reiterados intentos fallidos.`);
        } else if (authError.message.includes("Invalid login credentials")) {
          const remaining = failData.remainingAttempts !== undefined ? ` (${failData.remainingAttempts} intentos restantes)` : "";
          setError(`Credenciales inválidas. Verifica tu correo y contraseña${remaining}.`);
        } else {
          setError(authError.message);
        }
      } else if (data?.session) {
        // Limpiar contador tras éxito
        await fetch("/api/admin/auth-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "success" })
        }).catch(() => {});

        setIsAuthenticated(true);
      }
    } catch (err) {
      setError("Error al conectar con el servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignorar error al cerrar sesión
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-amber-400">
        <Sparkles className="animate-spin" size={32} />
      </div>
    );
  }

  // Pantalla de Bloqueo / Login con Supabase Auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl backdrop-blur-xl relative z-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 mb-4">
              <Lock size={30} />
            </div>
            <h2 className="text-2xl font-black font-heading text-white">Panel Procap Natural</h2>
            <p className="text-xs text-slate-400 mt-1">Inicia sesión con tu cuenta de administrador autorizada</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@protesiscapilarcolombia.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Autenticación Segura • Supabase Auth & J&M Tech Solutions</span>
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

