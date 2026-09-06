import nodemailer from "nodemailer";
import { OrderShipment } from "./orders-store";
import { formatPriceCOP } from "./products-store";

// Configuración del transporte SMTP con variables de entorno y fallback seguro
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const secure = port === 465;
  const user = process.env.SMTP_USER || "infprocap@gmail.com";
  const pass = process.env.SMTP_PASS || "Pro-cap33";

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

/**
 * Genera la plantilla HTML responsive y premium para el cliente según el estado de la orden o pago
 */
export function generateOrderConfirmationHtml(order: OrderShipment): string {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573151189795";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://protesiscapilarcolombia.com";

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
    headerBadgeText = `🚚 Despachado por ${order.carrier || "Transportadora"}`;
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
          Hola, <strong style="color: #ffffff;">${order.customer_name}</strong> 👋<br>
          ${isPending 
            ? "Hemos registrado la solicitud de pago de tu orden en la pasarela Wompi. A continuación te presentamos los detalles:" 
            : isShipped 
            ? "Tu paquete ha sido preparado y entregado a la transportadora con la máxima seguridad y privacidad. Aquí tienes los datos de tu despacho:" 
            : "Queremos confirmarte que la transacción fue procesada con éxito a través de Wompi. Aquí tienes el resumen oficial de tu pedido:"
          }
        </p>

        <!-- Información de Guía si ya fue Despachado -->
        ${order.tracking_number ? `
        <div class="card" style="border: 1px solid #0284c7; background: linear-gradient(135deg, #021636 0%, #032357 100%);">
          <div class="card-title" style="color: #38bdf8;">🚚 Datos de Seguimiento / Guía</div>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #1e3a68;">
              <td style="padding: 8px 0; color: #94a3b8;">Transportadora:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 800; text-align: right;">${order.carrier || "Transportadora Nacional"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e3a68;">
              <td style="padding: 8px 0; color: #94a3b8;">Número de Guía:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 900; font-family: monospace; font-size: 15px; text-align: right;">${order.tracking_number}</td>
            </tr>
            ${order.tracking_url ? `
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; text-align: center;">
                <a href="${order.tracking_url}" target="_blank" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 12px;">
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
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 800; text-align: right; font-family: monospace;">${order.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Producto / Sistema:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${order.product_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Método de Pago:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-weight: 600; text-align: right;">${order.payment_method || "Wompi Pasarela"}</td>
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
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${order.customer_name}</td>
            </tr>
            ${order.customer_document ? `
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Cédula / Documento:</td>
              <td style="padding: 8px 0; color: #cbd5e1; font-weight: 600; text-align: right;">${order.customer_document}</td>
            </tr>
            ` : ""}
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Teléfono de Contacto:</td>
              <td style="padding: 8px 0; color: #34d399; font-weight: 700; text-align: right;">${order.customer_phone.startsWith('+') ? order.customer_phone : `+${order.customer_phone}`}</td>
            </tr>
            <tr style="border-bottom: 1px solid #1e293b;">
              <td style="padding: 8px 0; color: #94a3b8;">Dirección:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 700; text-align: right;">${order.shipping_address}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Ciudad / Región:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 700; text-align: right;">${order.shipping_city} ${order.shipping_department ? `(${order.shipping_department})` : ""}</td>
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
          <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Procap Natural! Acabo de gestionar mi pedido *${order.id}* (${order.product_name}). ¿Me confirman estado de despacho?`)}" target="_blank" class="btn">
            💬 Hablar con mi Asesor por WhatsApp
          </a>
        </div>

      </div>

      <!-- Pie de Página -->
      <div class="footer">
        <strong style="color: #ffffff;">Procap Natural • Solución Capilar Indetectable</strong><br>
        📍 Calle 16 # 83a-15, Bogotá D.C., Colombia • Tel: +57 315 118 9795<br>
        Email: <a href="mailto:infprocap@gmail.com">infprocap@gmail.com</a> • Web: <a href="${siteUrl}">${siteUrl.replace('https://', '')}</a><br>
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
 * Función principal para enviar el correo al cliente y copia al admin
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

    const mailOptions = {
      from: `"Procap Natural" <${process.env.SMTP_USER || "infprocap@gmail.com"}>`,
      to: order.customer_email,
      bcc: "infprocap@gmail.com", // Copia oculta al equipo de Procap para aviso inmediato
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Correo enviado exitosamente a ${order.customer_email}. MessageId: ${info.messageId}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email Service Error] No se pudo enviar el correo:`, err);
    return { success: false, error: err.message };
  }
}
