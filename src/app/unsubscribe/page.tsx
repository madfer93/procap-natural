"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Por favor ingresa un correo electrónico válido.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unsubscribe", email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la solicitud.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center space-y-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Mail size={28} />
        </div>
        <h1 className="text-2xl font-heading font-black text-white">
          Gestión de Suscripción & Habeas Data
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          En cumplimiento de la Ley Estatutaria 1581 de 2012 (Protección de Datos Personales), puedes cancelar la recepción de correos publicitarios en cualquier momento.
        </p>
      </div>

      {success ? (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Desuscripción Confirmada</h3>
            <p className="text-xs text-slate-300 mt-1">
              Tu correo <strong>{email}</strong> ha sido eliminado de nuestras listas de promociones y ofertas.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            (Seguirás recibiendo únicamente las notificaciones directas sobre tus citas o compras confirmadas).
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Volver a la Página Principal</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Correo Electrónico a Dar de Baja
            </label>
            <input
              type="email"
              required
              placeholder="tu-correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 py-1">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Tratamiento de datos confidencial y seguro por J&M Tech Solutions.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{loading ? "Procesando..." : "Confirmar Desuscripción de Promociones"}</span>
          </button>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Volver al sitio web
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <Suspense fallback={<div className="text-amber-400 font-bold">Cargando...</div>}>
          <UnsubscribeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
