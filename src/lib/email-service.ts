import nodemailer from "nodemailer";
import { OrderShipment } from "./orders-store";
import { formatPriceCOP } from "./products-store";

// Configuración segura del transporte SMTP exclusivamente a través de variables de entorno
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("Credenciales SMTP no configuradas. Por favor define SMTP_USER y SMTP_PASS en las variables de entorno.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// Función de sanitización contra HTML Injection / XSS
function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Genera la plantilla HTML responsive y premium para el cliente según el estado de la orden o pago
 */
export function generateOrderConfirmationHtml(order: OrderShipment): string {
  const whatsappNumber = escapeHtml(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "");
  const siteUrl = escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || "https://protesiscapilarcolombia.com");

  // Sanitizar todos los campos provenientes del usuario
  const safeCustomerName = escapeHtml(order.customer_name);
  const safeProductName = escapeHtml(order.product_name);
  const safeOrderId = escapeHtml(order.id);
  const safeShippingAddress = escapeHtml(order.shipping_address);
  const safeShippingCity = escapeHtml(order.shipping_city);
  const safeShippingDept = escapeHtml(order.shipping_department);
  const safeDocument = escapeHtml(order.customer_document);
  const safePhone = escapeHtml(order.customer_phone);
  const safeCarrier = escapeHtml(order.carrier);
  const safeTracking = escapeHtml(order.tracking_number);
  const safeTrackingUrl = order.tracking_url && /^https?:\/\//i.test(order.tracking_url) ? encodeURI(order.tracking_url) : "";
  const safePaymentMethod = escapeHtml(order.payment_method || "Wompi Pasarela");

  const isPending = order.payment_status === "PENDING";
  const isShipped = order.shipping_status === "despachado" || order.shipping_status === "en_transito";

  let headerBadgeText = "✓ Pago Aprobado por Wompi";
  let headerBadgeBg = "rgba(16, 185, 129, 0.15)";
  let headerBadgeBorder = "rgba(16, 185, 129, 0.4)";
  let headerBadgeColor = "#34d399";
  let headerTitle = "¡Gracias por tu Compra!";
  let headerSubtitle = "Hemos recibido tu pago y tu pedido ya está siendo preparado en nuestro laboratorio capilar.";

  if (isPending) {
    headerBadgeText = "⏳ Pago en Proceso de Verificación";
    headerBadgeBg = "rgba(245, 158, 11, 0.15)";
    headerBadgeBorder = "rgba(245, 158, 11, 0.4)";
    headerBadgeColor = "#fbbf24";
    headerTitle = "Tu Pago está en Proceso";
    headerSubtitle = "Tu entidad bancaria o Wompi están validando la transacción. En cuanto se confirme, comenzaremos el despacho.";
  } else if (isShipped) {
    headerBadgeText = `🚚 Despachado por ${safeCarrier || "Transportadora"}`;
    headerBadgeBg = "rgba(56, 189, 248, 0.15)";
    headerBadgeBorder = "rgba(56, 189, 248, 0.4)";
    headerBadgeColor = "#38bdf8";
    headerTitle = "¡Tu Pedido ya va en Camino!";
    headerSubtitle = "Hemos entregado tu paquete a la transportadora con número de guía oficial para rastreo en tiempo real.";
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerTitle} - Procap Natural</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #03122c;
      color: #f1f5f9;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #03122c;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #031C45;
      border-radius: 24px;
      border: 1px solid #1e3a68;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .header {
      background: linear-gradient(135deg, #031C45 0%, #083372 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(56, 189, 248, 0.2);
    }
    .badge {
      display: inline-block;
      background-color: ${headerBadgeBg};
      border: 1px solid ${headerBadgeBorder};
      color: ${headerBadgeColor};
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }
    .content {
      padding: 28px 24px;
    }
    .card {
      background-color: #02112b;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 800;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0;
      margin-bottom: 14px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 8px;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 10px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #022c22 !important;
      font-size: 13px;
      font-weight: 900;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      letter-spacing: 0.2px;
    }
    .footer {
      background-color: #020c1e;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #38bdf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Encabezado -->
      <div class="header">
        <div class="badge">${headerBadgeText}</div>
        <h1 class="title">${headerTitle}</h1>
        <p class="subtitle">${headerSubtitle}</p>
      </div>

      <!-- Contenido Principal -->
      <div class="content">
        
        <!-- Saludo -->
        <p style="font-size: 14px; margin-top: 0; margin-bottom: 20px; line-height: 1.5;">
          Hola, <strong style="color: #ffffff;">${safeCustomerName}</strong> 👋<br>
          ${isPending 
            ? "Hemos registrado la solicitud de pago de tu orden en la pasarela Wompi. A continuación te presentamos los detalles:" 
            : isShipped 
            ? "Tu paquete ha sido preparado y entregado a la transportadora con la máxima seguridad y privacidad. Aquí tienes los datos de tu despacho:" 
            : "Queremos confirmarte que la transacción fue procesada con éxito a través de Wompi. Aquí tienes el resumen oficial de tu pedido:"
          }
        </p>

        <!-- Información de Guía si ya fue Despachado -->
        ${safeTracking ? `
        <div class="card" style="border: 1px solid #0284c7; background: linear-gradient(135deg, #021636 0%, #032357 100%);">
          <div class="card-title" style="color: #38bdf8;">🚚 Datos de Seguimiento / Guía</div>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #1e3a68;">
              <td style="padding: 8px 0; color: #94a3b8;">Transportadora:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 800; text-align: right;">${safeCarrier || "Transportadora Nacional"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e3a68;">
              <td style="padding: 8px 0; color: #94a3b8;">Número de Guía:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right;">${safeTracking}</td>
            </tr>
            ${safeTrackingUrl ? `
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; text-align: center;">
                <a href="${safeTrackingUrl}" target="_blank" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 12px;">
                  🔗 Rastrear mi Paquete en Línea
                </a>
              </td>
            </tr>
            ` : ""}
          </table>
        </div>
        ` : ""}

        <!-- Tarjeta de Producto -->
        <div class="card">
          <div class="card-title">📦 Resumen del Pedido</div>
          
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Número de Pedido:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 800; text-align: right; font-family: monospace;">${safeOrderId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Producto / Sistema:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safeProductName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Método de Pago:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-weight: 600; text-align: right;">${safePaymentMethod}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Estado del Pago:</td>
              <td style="padding: 8px 0; color: ${isPending ? '#fbbf24' : '#34d399'}; font-weight: 800; text-align: right;">
                ${isPending ? "⏳ En Verificación" : "✓ APROBADO"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0 4px 0; color: #ffffff; font-weight: 800;">Total:</td>
              <td style="padding: 10px 0 4px 0; color: #34d399; font-size: 16px; font-weight: 900; text-align: right;">${formatPriceCOP(order.amount_cop)}</td>
            </tr>
          </table>
        </div>

        <!-- Tarjeta de Envío -->
        <div class="card">
          <div class="card-title">📍 Datos de Envío & Destino</div>
          
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Destinatario:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safeCustomerName}</td>
            </tr>
            ${safeDocument ? `
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Cédula / Documento:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-weight: 600; text-align: right;">${safeDocument}</td>
            </tr>
            ` : ""}
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Teléfono de Contacto:</td>
              <td style="padding: 8px 0; color: #34d399; font-weight: 700; text-align: right;">${safePhone.startsWith('+') ? safePhone : `+${safePhone}`}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Dirección:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safeShippingAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Ciudad / Región:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 700; text-align: right;">${safeShippingCity} ${safeShippingDept ? `(${safeShippingDept})` : ""}</td>
            </tr>
          </table>
        </div>

        <!-- Línea de Tiempo del Despacho -->
        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 13px; color: #ffffff; margin-bottom: 12px;">🚚 Proceso de Envío y Despacho</h4>
          
          <table style="width: 100%; font-size: 12px; color: #cbd5e1;">
            <tr>
              <td style="width: 30px; vertical-align: top; padding-bottom: 12px;">
                <div style="background: ${isPending ? '#f59e0b' : '#0284c7'}; color: #fff; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: bold; font-size: 11px;">1</div>
              </td>
              <td style="vertical-align: top; padding-bottom: 12px;">
                <strong style="color: #ffffff;">${isPending ? 'Verificación de Pago:' : 'Control de Calidad & Empaque:'}</strong> ${isPending ? 'Wompi confirma la transacción y activa la orden en nuestro sistema.' : 'Verificamos la densidad, textura y empaque sellado de tu sistema en Bogotá.'}
              </td>
            </tr>
            <tr>
              <td style="width: 30px; vertical-align: top; padding-bottom: 12px;">
                <div style="background: ${isShipped ? '#10b981' : '#0284c7'}; color: #fff; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: bold; font-size: 11px;">2</div>
              </td>
              <td style="vertical-align: top; padding-bottom: 12px;">
                <strong style="color: #ffffff;">Despacho por Transportadora:</strong> Lo entregamos a Servientrega, Interrapidísimo o Coordinadora con guía asegurada.
              </td>
            </tr>
            <tr>
              <td style="width: 30px; vertical-align: top;">
                <div style="background: ${isShipped ? '#10b981' : '#64748b'}; color: #fff; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: bold; font-size: 11px;">3</div>
              </td>
              <td style="vertical-align: top;">
                <strong style="color: #ffffff;">Guía de Seguimiento en Tiempo Real:</strong> Recibirás tu tracking en WhatsApp y correo para seguirlo paso a paso.
              </td>
            </tr>
          </table>
        </div>

        <!-- Botón WhatsApp -->
        <div class="btn-container">
          <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Procap Natural! Acabo de gestionar mi pedido *${safeOrderId}* (${safeProductName}). ¿Me confirman estado de despacho?`)}" target="_blank" class="btn">
            💬 Hablar con mi Asesor por WhatsApp
          </a>
        </div>

      </div>

      <!-- Pie de Página -->
      <div class="footer">
        <strong style="color: #ffffff;">Procap Natural • Solución Capilar Indetectable</strong><br>
        📍 Calle 16 # 83a-15, Bogotá D.C., Colombia • Tel: +${whatsappNumber}<br>
        Web: <a href="${siteUrl}">${siteUrl.replace('https://', '')}</a><br>
        <p style="margin-top: 10px; font-size: 10px; color: #475569;">
          Este correo es una confirmación automática generada por el sistema tras una transacción en Wompi.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Función principal para enviar el correo al cliente y copia al admin por compras/Wompi
 */
export async function sendOrderConfirmationEmail(order: OrderShipment): Promise<{ success: boolean; error?: string }> {
  if (!order.customer_email) {
    console.log(`[Email Service] Pedido ${order.id} sin correo de cliente. Omitiendo envío.`);
    return { success: false, error: "Cliente sin email registrado" };
  }

  try {
    const transporter = getEmailTransporter();
    const htmlContent = generateOrderConfirmationHtml(order);

    const isPending = order.payment_status === "PENDING";
    const isShipped = order.shipping_status === "despachado" || order.shipping_status === "en_transito";

    let subject = `¡Pago Aprobado! 🎉 Confirmación de tu Pedido #${order.id} - Procap Natural`;
    if (isPending) {
      subject = `Pago en Proceso de Verificación ⏳ Pedido #${order.id} - Procap Natural`;
    } else if (isShipped && order.tracking_number) {
      subject = `¡Tu pedido ha sido Despachado! 🚚 Guía #${order.tracking_number} - Procap Natural`;
    }

    const senderEmail = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";

    const mailOptions = {
      from: `"Procap Natural" <${senderEmail}>`,
      to: order.customer_email,
      bcc: senderEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Correo de orden enviado exitosamente a ${order.customer_email}. MessageId: ${info.messageId}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email Service Error] No se pudo enviar el correo de orden:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Genera la plantilla HTML para confirmación de cita / agendamiento
 */
export function generateAppointmentConfirmationHtml(appointment: {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  location_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}): string {
  const whatsappNumber = escapeHtml(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795");
  const siteUrl = escapeHtml(process.env.NEXT_PUBLIC_SITE_URL || "https://protesiscapilarcolombia.com");

  const safeClientName = escapeHtml(appointment.client_name);
  const safeServiceName = escapeHtml(appointment.service_name);
  const safeLocation = escapeHtml(appointment.location_name);
  const safeDate = escapeHtml(appointment.appointment_date);
  const safeTime = escapeHtml(appointment.appointment_time);
  const safePhone = escapeHtml(appointment.client_phone);
  const safeNotes = escapeHtml(appointment.notes || "Ninguna especificada");
  const safeId = escapeHtml(appointment.id);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - Procap Natural</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #03122c;
      color: #f1f5f9;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #03122c;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #031C45;
      border-radius: 24px;
      border: 1px solid #1e3a68;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .header {
      background: linear-gradient(135deg, #031C45 0%, #0c3875 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(56, 189, 248, 0.2);
    }
    .badge {
      display: inline-block;
      background-color: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }
    .content {
      padding: 28px 24px;
    }
    .card {
      background-color: #02112b;
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 12px;
      font-weight: 800;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0;
      margin-bottom: 14px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 8px;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 10px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #022c22 !important;
      font-size: 13px;
      font-weight: 900;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      letter-spacing: 0.2px;
    }
    .footer {
      background-color: #020c1e;
      padding: 24px;
      text-align: center;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Encabezado -->
      <div class="header">
        <div class="badge">📅 Reserva Confirmada</div>
        <h1 class="title">¡Tu Cita está Programada!</h1>
        <p class="subtitle">Hemos reservado tu espacio exclusivo en nuestra cabina VIP individual.</p>
      </div>

      <!-- Contenido Principal -->
      <div class="content">
        
        <p style="font-size: 14px; margin-top: 0; margin-bottom: 20px; line-height: 1.6;">
          Hola, <strong style="color: #ffffff;">${safeClientName}</strong> 👋<br>
          Queremos confirmarte que tu cita con nuestros especialistas capilares ha sido agendada con éxito. A continuación te presentamos el resumen de tu sesión:
        </p>

        <!-- Tarjeta de Detalles de Cita -->
        <div class="card">
          <div class="card-title">💈 Detalles de la Reserva</div>
          
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Código de Cita:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 800; text-align: right; font-family: monospace;">${safeId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Servicio:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safeServiceName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Fecha:</td>
              <td style="padding: 8px 0; color: #34d399; font-weight: 800; text-align: right;">${safeDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Hora:</td>
              <td style="padding: 8px 0; color: #34d399; font-weight: 800; text-align: right;">${safeTime}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Sede / Ubicación:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${safeLocation}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Teléfono Registrado:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-weight: 600; text-align: right;">${safePhone}</td>
            </tr>
          </table>
        </div>

        <!-- Recomendaciones para la cita -->
        <div class="card" style="border: 1px solid rgba(56, 189, 248, 0.3); background: linear-gradient(135deg, #021636 0%, #032357 100%);">
          <div class="card-title" style="color: #38bdf8;">✨ Recomendaciones para tu Visita</div>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.8;">
            <li><strong>Puntualidad:</strong> Te sugerimos llegar 10 minutos antes para recibirte con comodidad.</li>
            <li><strong>Privacidad Total:</strong> Serás atendido en una cabina individual privada con aire acondicionado.</li>
            <li><strong>Atención Personalizada:</strong> Evaluaremos tu densidad capilar, color exacto y diseño de línea frontal natural.</li>
            <li><strong>Reprogramación:</strong> Si requieres cambiar tu horario, puedes notificarnos con 2 horas de anticipación por WhatsApp.</li>
          </ul>
        </div>

        <!-- Botón WhatsApp -->
        <div class="btn-container">
          <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Procap Natural! Acabo de agendar mi cita *${safeId}* para *${safeServiceName}* el *${safeDate}* a las *${safeTime}*. ¿Me pueden confirmar?`)}" target="_blank" class="btn">
            💬 Confirmar por WhatsApp
          </a>
        </div>

      </div>

      <!-- Pie de Página -->
      <div class="footer">
        <strong style="color: #ffffff;">Procap Natural • Solución Capilar Indetectable</strong><br>
        📍 Sedes en Bogotá, Cali, Neiva, Barranquilla y Giras Nacionales<br>
        Web: <a href="${siteUrl}" style="color: #38bdf8; text-decoration: none;">${siteUrl.replace('https://', '')}</a> • Tel: +${whatsappNumber}<br>
        <p style="margin-top: 10px; font-size: 10px; color: #475569;">
          Mensaje generado automáticamente desde el portal oficial de Procap Natural.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envía correo automático de confirmación de cita al cliente y copia al admin
 */
export async function sendAppointmentConfirmationEmail(appointment: {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  location_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getEmailTransporter();
    const htmlContent = generateAppointmentConfirmationHtml(appointment);
    const senderEmail = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";

    const recipients: string[] = [];
    if (appointment.client_email) {
      recipients.push(appointment.client_email);
    }

    const mailOptions = {
      from: `"Procap Natural" <${senderEmail}>`,
      to: recipients.length > 0 ? recipients : senderEmail,
      bcc: senderEmail,
      subject: `Confirmación de Reserva 📅 ${appointment.service_name} - ${appointment.appointment_date} ${appointment.appointment_time}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Correo de cita enviado exitosamente. MessageId: ${info.messageId}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email Service Error] No se pudo enviar el correo de cita:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Envía alerta por correo al administrador sobre nuevo lead / cotización
 */
export async function sendNewLeadAlertEmail(lead: {
  user_name?: string;
  user_phone?: string;
  interest_product?: string;
  summary?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getEmailTransporter();
    const senderEmail = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";
    const safeName = escapeHtml(lead.user_name || "Prospecto Web");
    const safePhone = escapeHtml(lead.user_phone || "Sin teléfono");
    const safeProduct = escapeHtml(lead.interest_product || "Consulta general");
    const safeSummary = escapeHtml(lead.summary || "Nuevo contacto desde el sitio web");

    const htmlContent = `
      <div style="font-family: sans-serif; background: #03122c; color: #fff; padding: 24px; border-radius: 16px;">
        <h2 style="color: #38bdf8; margin-top: 0;">🔥 Nuevo Prospecto / Lead Capturado</h2>
        <p>Se ha registrado un nuevo usuario interesado en Procap Natural:</p>
        <div style="background: #031C45; padding: 16px; border-radius: 12px; border: 1px solid #1e3a68;">
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>WhatsApp / Tel:</strong> ${safePhone}</p>
          <p><strong>Interés:</strong> ${safeProduct}</p>
          <p><strong>Resumen de Consulta:</strong> ${safeSummary}</p>
        </div>
        <p style="margin-top: 16px;">
          <a href="https://wa.me/${safePhone.replace(/\D/g, '')}" style="background: #10b981; color: #000; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Contactar por WhatsApp
          </a>
        </p>
      </div>
    `;

    const mailOptions = {
      from: `"Procap Natural Bot" <${senderEmail}>`,
      to: senderEmail,
      subject: `🔥 Nuevo Lead Capilar: ${safeName} (${safeProduct})`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Alerta de lead enviada al admin. MessageId: ${info.messageId}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email Service Error] No se pudo enviar alerta de lead:`, err);
    return { success: false, error: err.message };
  }
}

