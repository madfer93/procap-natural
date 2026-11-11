import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de productos no vacío." },
        { status: 400 }
      );
    }

    // Normalizar datos
    const normalizedProducts: Product[] = products.map((item: any, idx: number) => {
      const priceOffer = Number(item.price_offer) || 100000;
      const priceRegular = Number(item.price_regular) || Math.round(priceOffer * 1.2);
      const costPrice = Number(item.cost_price_cop) || Math.round(priceOffer * 0.4);

      let category = item.category || "sistemas";
      const validCategories = ["sistemas", "adhesivos", "cintas", "cuidados", "servicios"];
      if (!validCategories.includes(category)) {
        const lower = String(category).toLowerCase();
        if (lower.includes("pegamento") || lower.includes("adhesivo") || lower.includes("glue")) category = "adhesivos";
        else if (lower.includes("cinta") || lower.includes("tape")) category = "cintas";
        else if (lower.includes("disolvente") || lower.includes("c-22") || lower.includes("cuidado") || lower.includes("shampoo")) category = "cuidados";
        else if (lower.includes("servicio") || lower.includes("instalacion") || lower.includes("mantenimiento")) category = "servicios";
        else category = "sistemas";
      }

      return {
        id: item.id || `prod-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(7)}`,
        name: String(item.name || "Producto Sin Nombre").trim(),
        category,
        type: item.type || (category === "sistemas" ? "Prótesis Capilar" : "Insumo Profesional"),
        description: item.description || `Producto original Procap Natural - Calidad garantizada.`,
        price_offer: priceOffer,
        price_regular: priceRegular,
        cost_price_cop: costPrice,
        stock_quantity: item.stock_quantity !== undefined ? Number(item.stock_quantity) : 10,
        min_stock_alert: item.min_stock_alert !== undefined ? Number(item.min_stock_alert) : 2,
        badge: item.badge || "Disponible",
        image_url: item.image_url || "/favicons/android-chrome-192x192.png",
        secondary_image_url: item.secondary_image_url || "",
        payment_link: item.payment_link || "",
        payment_link_credit: item.payment_link_credit || "",
        promo_hook_active: Boolean(item.promo_hook_active),
        promo_hook_title: item.promo_hook_title || "",
        promo_hook_desc: item.promo_hook_desc || "",
        promo_hook_price: Number(item.promo_hook_price) || 0,
        is_available: item.is_available !== false,
        is_featured: Boolean(item.is_featured),
        order_index: item.order_index || (idx + 1)
      };
    });

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("products")
        .upsert(normalizedProducts, { onConflict: "id" })
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        count: data ? data.length : normalizedProducts.length,
        products: data || normalizedProducts
      });
    }

    return NextResponse.json({
      success: true,
      count: normalizedProducts.length,
      products: normalizedProducts,
      source: "local"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

