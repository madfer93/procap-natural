import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export interface ReelItem {
  id: string;
  title: string;
  tag: string;
  category: "transformacion" | "instalacion" | "mantenimiento" | "deporte";
  videoUrl: string;
  posterUrl?: string;
  views?: string;
  source: "instagram" | "tiktok" | "direct";
  socialUrl?: string;
  order_index?: number;
}

const DEFAULT_REELS: ReelItem[] = [
  {
    id: "reel-1",
    title: "Transformación Total: De Alopecia Severa a Línea Frontal 100% Invisible",
    tag: "🔥 Más Viral",
    category: "transformacion",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "142K vistas",
    source: "tiktok",
    socialUrl: "https://www.tiktok.com/@procapnatural"
  },
  {
    id: "reel-2",
    title: "Prueba de Agua & Deporte: Resistencia Extrema en Gimnasio y Piscina",
    tag: "⚡ Indestructible",
    category: "deporte",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "98K vistas",
    source: "instagram",
    socialUrl: "https://instagram.com/protesiscapilarnatural"
  },
  {
    id: "reel-3",
    title: "Paso a Paso en Cabina VIP: Adaptación y Corte Personalizado en Bogotá",
    tag: "⭐ Salón Chicó",
    category: "instalacion",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "64K vistas",
    source: "tiktok",
    socialUrl: "https://www.tiktok.com/@procapnatural"
  },
  {
    id: "reel-4",
    title: "Mantenimiento Preventivo: Retiro Suave con C-22 y Cuero Cabelludo Sano",
    tag: "💆 Mantenimiento",
    category: "mantenimiento",
    videoUrl: "https://pub-426a082ba0a64de0bcf1da7c816f7c38.r2.dev/PROCAPS-OFICINA.mp4",
    views: "53K vistas",
    source: "instagram",
    socialUrl: "https://instagram.com/protesiscapilarnatural"
  }
];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .eq("key", "reels_videos")
        .single();

      if (!error && data?.value && Array.isArray(data.value) && data.value.length > 0) {
        return NextResponse.json({ reels: data.value, source: "supabase" });
      }
    }

    return NextResponse.json({ reels: DEFAULT_REELS, source: "default" });
  } catch (err: any) {
    return NextResponse.json({ reels: DEFAULT_REELS, error: err.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase no está configurado." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const reels: ReelItem[] = Array.isArray(body) ? body : body.reels;

    if (!Array.isArray(reels)) {
      return NextResponse.json({ error: "Formato de lista de reels inválido." }, { status: 400 });
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "reels_videos",
        value: reels,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reels });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

