import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export interface SiteSettingsData {
  groq_api_key?: string;
  whatsapp_number?: string;
  admin_pin?: string;
  address?: string;
  // Pasarelas de Pago Colombia
  wompi_public_key?: string;
  wompi_integrity_secret?: string;
  wompi_checkout_url?: string;
  sistecredito_merchant_id?: string;
  sistecredito_url?: string;
  addi_client_id?: string;
  addi_widget_enabled?: boolean;
  addi_checkout_url?: string;
  // Video de Presentación Hero
  hero_video_url?: string;
  hero_video_poster?: string;
  hero_video_title?: string;
  hero_video_badge?: string;
  // Cloudflare R2 Storage
  cloudflare_r2_account_id?: string;
  cloudflare_r2_access_key_id?: string;
  cloudflare_r2_secret_access_key?: string;
  cloudflare_r2_bucket_name?: string;
  cloudflare_r2_public_url?: string;
}

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase no está configurado en las variables de entorno." },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .eq("key", "general_config")
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const settings: SiteSettingsData = data?.value || {};
    return NextResponse.json({ settings, source: "supabase" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, settings: {} }, { status: 500 });
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

    const body: SiteSettingsData = await req.json();

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "general_config",
        value: body,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
