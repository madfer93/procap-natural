"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Scissors, 
  Settings, 
  Bot, 
  ExternalLink, 
  LogOut,
  Sparkles
} from "lucide-react";

interface AdminNavProps {
  onLogout?: () => void;
}

export function AdminNav({ onLogout }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Productos & Sistemas", icon: Package },
    { href: "/admin/leads", label: "Leads & Chatbot IA", icon: Bot },
    { href: "/admin/settings", label: "Ajustes & Pasarelas", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              P
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white tracking-wide block">
                PROCAP <span className="text-amber-400">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Panel de Control</span>
            </div>
          </Link>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Gestión
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon size={16} className={isActive ? "text-slate-950" : "text-amber-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-900 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Accesos Rápidos
          </span>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-emerald-400" />
              <span>Ver Tienda Pública</span>
            </span>
            <span className="text-[10px] text-slate-500">↗</span>
          </Link>

          <a
            href="https://sbfxirefisjusosfotks.supabase.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>Supabase Studio</span>
            </span>
            <span className="text-[10px] text-slate-500">↗</span>
          </a>
        </div>

      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-900">
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        )}
        <div className="mt-3 text-center text-[10px] text-slate-600">
          Procap Natural v1.0 • J&M Tech
        </div>
      </div>
    </aside>
  );
}
