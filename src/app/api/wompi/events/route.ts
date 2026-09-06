import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { OrderShipment } from "@/lib/orders-store";
import { sendOrderConfirmationEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

/**
 * Valida la firma de integridad de Wompi si la variable WOMPI_EVENTS_SECRET está configurada
 */
function verifyWompiSignature(payload: any, secret: string): boolean {
  try {
    const signature = payload?.signature;
    if (!signature || !signature.checksum || !signature.properties || !payload.timestamp) {
      return false;
    }

    // Concatenar los valores según el orden de properties especificado por Wompi
    let concatenated = "";
    for (const propPath of signature.properties) {
      const parts = propPath.split(".");
      let val = payload.data;
      for (const part of parts) {
        val = val?.[part];
      }
      concatenated += val !== undefined ? String(val) : "";
    }

    concatenated += String(payload.timestamp);
    concatenated += secret;

    const hash = crypto.createHash("sha256").update(concatenated).digest("hex");
    return hash.toLowerCase() === signature.checksum.toLowerCase();
  } catch (err) {
    console.error("[Wompi Signature Verification Error]", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // 1. Verificación de firma criptográfica si existe WOMPI_EVENTS_SECRET
    const wompiSecret = process.env.WOMPI_EVENTS_SECRET;
    if (wompiSecret) {
      const isValid = verifyWompiSignature(payload, wompiSecret);
      if (!isValid) {
        console.warn("[Wompi Security Alert] Webhook recibido con firma inválida o adulterada.");
        return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
      }
    }

    // 2. Validar estructura del webhook de Wompi
    const transaction = payload.data?.transaction;

    if (!transaction) {
      return NextResponse.json({ message: "Payload recibido sin transacción." }, { status: 200 });
    }

    const txId = String(transaction.id || "");
    const status = transaction.status; // 'APPROVED', 'PENDING', 'DECLINED', 'VOIDED', 'ERROR'
    const amountInCents = Number(transaction.amount_in_cents) || 0;
    const amountCop = amountInCents / 100;
    const reference = String(transaction.reference || "Venta Web Procap").slice(0, 100);
    const paymentMethodType = String(transaction.payment_method_type || "Wompi").slice(0, 50);

    // Datos del cliente y envío provistos por Wompi
    const customerData = transaction.customer_data || {};
    const shippingAddress = transaction.shipping_address || {};

    const customerName = String(customerData.full_name || transaction.customer_email || "Cliente Wompi").slice(0, 150);
    const customerPhone = String(customerData.phone_number || "").slice(0, 30);
    const customerEmail = String(transaction.customer_email || customerData.email || "").slice(0, 150);
    const customerDocument = String(customerData.legal_id || "").slice(0, 50);

    const fullAddress = [
      shippingAddress.address_line_1,
      shippingAddress.address_line_2
    ].filter(Boolean).join(", ").slice(0, 250) || "Dirección ingresada en pasarela";

    const city = String(shippingAddress.city || "Bogotá D.C.").slice(0, 100);
    const department = String(shippingAddress.region || "Cundinamarca").slice(0, 100);

    const orderId = `ORD-${reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}-${txId.slice(-4)}`;

    const newOrder: OrderShipment = {
      id: orderId,
      wompi_transaction_id: txId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_document: customerDocument,
      shipping_address: fullAddress,
      shipping_city: city,
      shipping_department: department,
      product_name: reference,
      amount_cop: amountCop,
      payment_method: `Wompi (${paymentMethodType})`,
      payment_status: status,
      shipping_status: status === "APPROVED" ? "pendiente" : "pendiente",
      notes: `Pago procesado vía Wompi Event Webhook. Ref: ${reference}`,
      created_at: transaction.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Guardar o actualizar en Supabase
    if (isSupabaseConfigured()) {
      await supabase
        .from("orders")
        .upsert(newOrder, { onConflict: "id" });
    }

    // Disparar envío automático de correo electrónico corporativo al cliente
    let emailResult: { success: boolean; error?: string } = { success: false, error: "No intentado" };
    if (customerEmail && (status === "APPROVED" || status === "PENDING")) {
      try {
        emailResult = await sendOrderConfirmationEmail(newOrder);
      } catch (e: any) {
        console.error(`[Wompi Webhook] Error al enviar email:`, e);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Evento Wompi procesado y registrado exitosamente en despachos.",
      orderId: orderId,
      status: status,
      emailSent: emailResult.success
    }, { status: 200 });

  } catch (err: any) {
    console.error("Error al procesar webhook de Wompi:", err);
    return NextResponse.json({ error: "Error interno al procesar el evento" }, { status: 500 });
  }
}
