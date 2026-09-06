import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INITIAL_ORDERS, OrderShipment } from "@/lib/orders-store";

export const dynamic = "force-dynamic";

let inMemoryOrders: OrderShipment[] = [...INITIAL_ORDERS];

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ orders: data, source: "supabase" });
      }
    }

    return NextResponse.json({ orders: inMemoryOrders, source: "memory" });
  } catch (err: any) {
    return NextResponse.json({ orders: inMemoryOrders, source: "fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<OrderShipment> = await req.json();

    if (!body.customer_name || !body.customer_phone || !body.product_name) {
      return NextResponse.json({ error: "Nombre, teléfono y producto son requeridos." }, { status: 400 });
    }

    const newOrder: OrderShipment = {
      id: body.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email || "",
      customer_document: body.customer_document || "",
      shipping_address: body.shipping_address || "Por coordinar",
      shipping_city: body.shipping_city || "Bogotá D.C.",
      shipping_department: body.shipping_department || "",
      product_name: body.product_name,
      product_sku: body.product_sku || "",
      amount_cop: Number(body.amount_cop) || 0,
      payment_method: body.payment_method || "Wompi",
      payment_status: body.payment_status || "APPROVED",
      carrier: body.carrier || "",
      tracking_number: body.tracking_number || "",
      tracking_url: body.tracking_url || "",
      shipping_status: body.shipping_status || "pendiente",
      shipping_cost: Number(body.shipping_cost) || 0,
      notes: body.notes || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("orders")
        .upsert(newOrder)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ order: data, success: true });
      }
    }

    inMemoryOrders.unshift(newOrder);
    return NextResponse.json({ order: newOrder, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, carrier, tracking_number, tracking_url, shipping_status, shipping_cost, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de pedido requerido" }, { status: 400 });
    }

    const updateFields: any = {
      updated_at: new Date().toISOString()
    };

    if (carrier !== undefined) updateFields.carrier = carrier;
    if (tracking_number !== undefined) updateFields.tracking_number = tracking_number;
    if (tracking_url !== undefined) updateFields.tracking_url = tracking_url;
    if (shipping_status !== undefined) updateFields.shipping_status = shipping_status;
    if (shipping_cost !== undefined) updateFields.shipping_cost = Number(shipping_cost);
    if (notes !== undefined) updateFields.notes = notes;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("orders")
        .update(updateFields)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ order: data, success: true });
      }
    }

    inMemoryOrders = inMemoryOrders.map(o => o.id === id ? { ...o, ...updateFields } : o);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      await supabase
        .from("orders")
        .delete()
        .eq("id", id);
    }

    inMemoryOrders = inMemoryOrders.filter(o => o.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
