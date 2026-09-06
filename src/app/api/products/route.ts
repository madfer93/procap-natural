import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INITIAL_PRODUCTS, Product } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ products: data, source: "supabase" });
      }
    }

    // Fallback a catálogo inicial
    return NextResponse.json({ products: INITIAL_PRODUCTS, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ products: INITIAL_PRODUCTS, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Product = await req.json();

    if (!body.name || !body.category || !body.price_offer) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }

    const newProduct: Product = {
      ...body,
      id: body.id || `prod-${Date.now()}`,
      is_available: body.is_available !== undefined ? body.is_available : true,
      price_regular: body.price_regular || body.price_offer,
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("products")
        .upsert(newProduct)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ product: data, success: true });
    }

    return NextResponse.json({ product: newProduct, success: true, warning: "Supabase no configurado" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Partial<Product> & { id: string } = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID del producto requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ product: data, success: true });
    }

    return NextResponse.json({ product: body, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
