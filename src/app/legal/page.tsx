import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getLegalDocuments } from "@/lib/legal-store";
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Cpu, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Scale, 
  ExternalLink 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Centro de Políticas Legales & Transparencia | Procap Natural Colombia",
  description: "Conoce nuestras políticas oficiales de Habeas Data (Ley 1581), Garantías y Devoluciones (Ley 1480), Uso Ético de IA (ISO/IEC 42001) y Términos del Servicio de Procap Natural.",
  alternates: {
    canonical: "https://protesiscapilarcolombia.com/legal"
  }
};

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  FileText,
  RotateCcw,
  Cpu,
  Camera
};

export default async function LegalHubPage() {
  const documents = await getLegalDocuments();

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold tracking-wide uppercase">
            <Scale size={14} /> Marco Jurídico & Transparencia Oficial
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            Centro de Políticas <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Legales & Éticas</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            En Procap Natural operamos bajo estricto apego a la legislación colombiana (Ley 1581 de 2012, Ley 1480 de 2011) y estándares internacionales de inteligencia artificial (ISO/IEC 42001). Consulta nuestras políticas vigentes.
          </p>
        </div>

        {/* Security / Compliance Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Habeas Data</p>
              <p className="text-[11px] text-slate-400">Ley 1581 de 2012</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Pagos 100% Seguros</p>
              <p className="text-[11px] text-slate-400">Wompi & Sistecrédito</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">IA Ética y Transparente</p>
              <p className="text-[11px] text-slate-400">Norma ISO/IEC 42001</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Estatuto Consumidor</p>
              <p className="text-[11px] text-slate-400">Ley 1480 de 2011</p>
            </div>
          </div>
        </div>

        {/* Legal Documents Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const IconComponent = ICON_MAP[doc.icon_name] || FileText;

            return (
              <div
                key={doc.slug}
                className="group p-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-500/5 relative overflow-hidden"
              >
                {/* Top Badge & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#031C45] border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                      <IconComponent size={24} />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 text-sky-300 border border-slate-800">
                      {doc.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {doc.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="pt-6 mt-6 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Versión {doc.version} • {doc.last_updated}
                  </span>
                  
                  <Link
                    href={`/legal/${doc.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-sky-300 group-hover:translate-x-1 transition-all"
                  >
                    <span>Leer completa</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Contact / PQR Help Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#031C45] via-slate-950 to-slate-950 border border-sky-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">¿Tienes dudas legales, peticiones o deseas ejercer tu derecho de Habeas Data?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Nuestro canal oficial de PQR y protección de datos está a tu disposición en <span className="text-sky-300 font-semibold">infprocap@gmail.com</span> o directamente a través de nuestra línea de atención prioritaria.
            </p>
          </div>

          <a
            href="https://wa.me/573151189795?text=Hola,%20deseo%20hacer%20una%20consulta%20legal/PQR%20sobre%20mis%20datos%20en%20Procap%20Natural."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-400/20 transition-all shrink-0 hover:scale-105"
          >
            <span>Radicar Consulta PQR</span>
            <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </main>
  );
}
