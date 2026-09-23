"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Bot, 
  ExternalLink, 
  LogOut,
  Sparkles,
  Calendar,
  MapPin,
  Truck,
  Scale,
  Building2,
  ShoppingBag,
  Users,
  TrendingUp,
  Menu,
  X,
  LucideIcon
} from "lucide-react";

interface AdminNavProps {
  onLogout?: () => void;
}

interface NavGroup {
  group: string;
  items: {
    href: string;
    label: string;
    icon: any;
    exact?: boolean;
    badge?: string;
  }[];
}

export function AdminNav({ onLogout }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navGroups: NavGroup[] = [
    {
      group: "Operación & Ventas",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/admin/pos", label: "Terminal POS Cabinas", icon: ShoppingBag, badge: "POS" },
        { href: "/admin/appointments", label: "Agenda & Citas", icon: Calendar },
        { href: "/admin/orders", label: "Envíos & Guías", icon: Truck },
      ],
    },
    {
      group: "Gestión & Finanzas",
      items: [
        { href: "/admin/contabilidad", label: "Contabilidad & P&L", icon: TrendingUp },
        { href: "/admin/vendedores", label: "Vendedores & Sedes", icon: Users },
        { href: "/admin/products", label: "Productos & Stock", icon: Package },
        { href: "/admin/sedes", label: "Sedes & Instalaciones", icon: Building2 },
        { href: "/admin/events", label: "Giras & Eventos", icon: MapPin },
      ],
    },
    {
      group: "Sistema & Legal",
      items: [
        { href: "/admin/leads", label: "Leads & Chatbot IA", icon: Bot },
        { href: "/admin/legal", label: "Políticas & Legal (ISO)", icon: Scale },
        { href: "/admin/settings", label: "Ajustes & Pasarelas", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. HEADER MÓVIL COMPACTO (Pantallas < 1024px) */}
      {/* ============================================================ */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between select-none">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md text-xs">
            P
          </div>
          <div>
            <span className="font-heading font-black text-xs text-white tracking-wide block">
              PROCAP <span className="text-amber-400 font-extrabold">ADMIN</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-amber-400 transition-colors"
            aria-label="Abrir menú de administración"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[53px] bottom-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 border-b border-slate-800">
          <nav className="space-y-4 pb-12">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                  {group.group}
                </span>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? pathname === item.href 
                      : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className={isActive ? "text-amber-400" : "text-slate-400"} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-bold bg-amber-400/20 text-amber-300">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900/60"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={14} className="text-emerald-400" />
                  <span>Ver Tienda Pública</span>
                </span>
                <span>↗</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. SIDEBAR ESCRITORIO (Pantallas >= 1024px) */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800/80 flex-col justify-between p-3.5 shrink-0 min-h-screen select-none">
      <div className="space-y-4">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 px-2">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform text-xs">
              P
            </div>
            <div>
              <span className="font-heading font-black text-xs text-white tracking-wide block">
                PROCAP <span className="text-amber-400 font-extrabold">ADMIN</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Panel Maestro</span>
            </div>
          </Link>
        </div>

        {/* Links Navigation agrupados */}
        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2.5 block mb-1">
                {group.group}
              </span>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon 
                          size={15} 
                          className={`transition-colors shrink-0 ${
                            isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                          }`} 
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Links */}
        <div className="pt-3 border-t border-slate-900 space-y-1 px-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-1.5 block mb-1">
            Accesos Rápidos
          </span>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} className="text-emerald-400/80" />
              <span className="text-[11px]">Tienda Pública</span>
            </span>
            <span className="text-[10px] text-slate-500">↗</span>
          </Link>

          <a
            href={process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.com/dashboard"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={13} className="text-amber-400/80" />
              <span className="text-[11px]">Supabase</span>
            </span>
            <span className="text-[10px] text-slate-500">↗</span>
          </a>
        </div>

      </div>{/* ← cierra div.space-y-4 */}

      {/* Footer / Logout */}
      <div className="pt-3 border-t border-slate-900">
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-red-500/15 text-slate-400 hover:text-red-300 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Cerrar Sesión</span>
          </button>
        )}
        <div className="mt-2 text-center text-[9px] text-slate-600">
          Procap v1.0 • J&M Tech
        </div>
      </div>
    </aside>
  </>
);
}
