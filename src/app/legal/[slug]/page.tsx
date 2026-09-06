import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLegalDocuments, getLegalDocumentBySlug } from "@/lib/legal-store";
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Cpu, 
  Camera, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Scale, 
  Printer, 
  Share2 
} from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  FileText,
  RotateCcw,
  Cpu,
  Camera
};

export async function generateStaticParams() {
  const docs = await getLegalDocuments();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = await getLegalDocumentBySlug(params.slug);
  if (!doc) {
    return {
      title: "Documento Legal No Encontrado | Procap Natural",
    };
  }

  return {
    title: `${doc.title} | Procap Natural Colombia`,
    description: doc.summary,
    alternates: {
      canonical: `https://protesiscapilarcolombia.com/legal/${doc.slug}`
    }
  };
}

export default async function LegalDocumentDetailPage({ params }: PageProps) {
  const { slug } = params;
  const doc = await getLegalDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const allDocs = await getLegalDocuments();
  const IconComponent = ICON_MAP[doc.icon_name] || FileText;

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/legal"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Centro de Políticas Legales</span>
          </Link>

          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-300">
            {doc.badge}
          </span>
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Legal Content Article */}
          <article className="lg:col-span-3 p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-8">
            
            {/* Document Header */}
            <div className="border-b border-slate-800 pb-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#031C45] border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                  <IconComponent size={24} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black font-heading text-white">
                    {doc.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-sky-400" />
                      Última actualización: {doc.last_updated}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">
                      Versión oficial {doc.version}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-400/20 text-xs text-sky-200 leading-relaxed">
                <strong>Resumen Ejecutivo:</strong> {doc.summary}
              </div>
            </div>

            {/* Document Body (Formatted Markdown/Text) */}
            <div className="prose prose-invert max-w-none space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {doc.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Títulos H1 (#)
                if (trimmed.startsWith('# ')) {
                  return (
                    <h2 key={pIdx} className="text-lg sm:text-xl font-bold font-heading text-white pt-4 pb-2 border-b border-slate-800 text-sky-400">
                      {trimmed.replace(/^#\s+/, '')}
                    </h2>
                  );
                }

                // Títulos H3 (###)
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-sm sm:text-base font-bold font-heading text-sky-300 pt-3">
                      {trimmed.replace(/^###\s+/, '')}
                    </h3>
                  );
                }

                // Separadores (---)
                if (trimmed === '---') {
                  return <hr key={pIdx} className="border-slate-800 my-6" />;
                }

                // Listas con viñetas (- )
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={pIdx} className="space-y-2 pl-4 list-disc text-slate-300 marker:text-sky-400">
                      {items.map((item, iIdx) => {
                        const cleanItem = item.replace(/^[-*]\s+/, '');
                        return (
                          <li key={iIdx} className="leading-relaxed">
                            {formatTextWithBold(cleanItem)}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                // Listas numeradas (1. )
                if (/^\d+\.\s+/.test(trimmed)) {
                  const items = trimmed.split('\n');
                  return (
                    <ol key={pIdx} className="space-y-2 pl-5 list-decimal text-slate-300 marker:text-amber-400 font-medium">
                      {items.map((item, iIdx) => {
                        const cleanItem = item.replace(/^\d+\.\s+/, '');
                        return (
                          <li key={iIdx} className="leading-relaxed">
                            {formatTextWithBold(cleanItem)}
                          </li>
                        );
                      })}
                    </ol>
                  );
                }

                // Párrafo estándar
                return (
                  <p key={pIdx} className="leading-relaxed text-slate-300">
                    {formatTextWithBold(trimmed)}
                  </p>
                );
              })}
            </div>

            {/* Document Footer Signature */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Scale size={14} className="text-sky-400" />
                <span>Documento oficial expedido para Procap Natural Colombia.</span>
              </div>
              <span>Vigencia legal 2026</span>
            </div>

          </article>

          {/* Sidebar with Navigation of other legal policies */}
          <aside className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Todas las Políticas
              </span>

              <nav className="space-y-2">
                {allDocs.map((item) => {
                  const ItemIcon = ICON_MAP[item.icon_name] || FileText;
                  const isActive = item.slug === doc.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={`/legal/${item.slug}`}
                      className={`flex items-start gap-3 p-3 rounded-2xl text-xs transition-all ${
                        isActive
                          ? "bg-sky-500/20 border border-sky-400/40 text-sky-300 font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                      }`}
                    >
                      <ItemIcon size={16} className={`shrink-0 mt-0.5 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{item.short_title}</span>
                        <span className="text-[10px] text-slate-500 font-normal block">{item.badge}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Contact / Support Card */}
            <div className="p-6 rounded-3xl bg-[#031C45]/60 border border-sky-400/30 text-xs space-y-3">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-400" /> Atención Legal
              </h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                ¿Requieres una copia firmada o formular un requerimiento oficial?
              </p>
              <a
                href="mailto:infprocap@gmail.com"
                className="block w-full text-center py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold transition-colors"
              >
                infprocap@gmail.com
              </a>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}

// Función auxiliar para parsear negritas **texto**
function formatTextWithBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
