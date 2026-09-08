import { NextRequest, NextResponse } from "next/server";
import { getEmailTransporter } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.to || process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";

    const transporter = getEmailTransporter();
    const senderEmail = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://protesiscapilarcolombia.com";

    const info = await transporter.sendMail({
      from: `"Procap Natural (Test)" <${senderEmail}>`,
      to: targetEmail,
      subject: `🧪 Correo de Prueba - Procap Natural & Namecheap SMTP`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #03122c; padding: 30px 15px; color: #f1f5f9;">
          <div style="max-width: 540px; margin: auto; background-color: #031C45; border-radius: 24px; border: 1px solid #1e3a68; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
            
            <!-- Header con Logo -->
            <div style="background: linear-gradient(135deg, #02122c 0%, #06285a 100%); padding: 32px 20px; text-align: center; border-bottom: 1px solid rgba(56, 189, 248, 0.2);">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none;">
                <img src="${siteUrl}/favicons/android-chrome-192x192.png" alt="Procap Natural Logo" width="60" height="60" style="border-radius: 14px; border: 1.5px solid rgba(56, 189, 248, 0.4); background-color: #031C45; padding: 3px; display: inline-block; box-shadow: 0 6px 16px rgba(0,0,0,0.5);">
              </a>
              <div style="font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #38bdf8; margin: 8px 0 10px 0;">PROCAP <span style="color: #ffffff;">NATURAL</span></div>
              <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 12px; border-radius: 9999px;">
                ✓ Servidor SMTP Conectado
              </div>
              <h1 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 12px 0 4px 0;">¡Prueba de Correo Exitosa!</h1>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">Namecheap Private Email • Transaccional Oficial</p>
            </div>

            <!-- Body -->
            <div style="padding: 24px;">
              <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 0;">
                El sistema de notificaciones automáticas de <strong>Procap Natural</strong> está activo y autenticado para enviar correos oficiales a clientes y administradores.
              </p>

              <div style="background-color: #02112b; border: 1px solid #1e293b; border-radius: 14px; padding: 16px; margin: 18px 0; font-size: 12px;">
                <div style="color: #38bdf8; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                  📋 Diagnóstico de Conexión
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #94a3b8;">
                  <tr style="border-bottom: 1px solid #1e293b;">
                    <td style="padding: 6px 0;">Buzón Remitente:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: bold; text-align: right; font-family: monospace;">${senderEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #1e293b;">
                    <td style="padding: 6px 0;">Servidor Host:</td>
                    <td style="padding: 6px 0; color: #cbd5e1; text-align: right; font-family: monospace;">${process.env.SMTP_HOST || "mail.privateemail.com"}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #1e293b;">
                    <td style="padding: 6px 0;">Puerto / Seguridad:</td>
                    <td style="padding: 6px 0; color: #34d399; font-weight: bold; text-align: right;">${process.env.SMTP_PORT || "465"} (SSL/TLS)</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">Destinatario Prueba:</td>
                    <td style="padding: 6px 0; color: #38bdf8; font-weight: bold; text-align: right;">${targetEmail}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 14px; font-size: 12px; color: #34d399; line-height: 1.8;">
                ✓ <strong>Citas Online (/agendar):</strong> Confirmación automática al cliente con sede, fecha y recomendaciones.<br>
                ✓ <strong>Tienda Wompi (/catalogo):</strong> Envío de comprobante de pago y número de guía.<br>
                ✓ <strong>Leads CapilarBot (/api/leads):</strong> Notificación inmediata al buzón de administración.
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #020c1e; padding: 20px; text-align: center; border-top: 1px solid #1e293b; font-size: 10.5px; color: #64748b; line-height: 1.6;">
              <strong style="color: #ffffff;">PROCAP NATURAL • SOLUCIÓN CAPILAR INDETECTABLE</strong><br>
              Bogotá (Chicó Norte) • Cali (El Ingenio 3) • Neiva (Canaima) • Barranquilla (Centro Histórico)<br>
              Web: <a href="${siteUrl}" style="color: #38bdf8; text-decoration: none;">${siteUrl.replace('https://', '')}</a>
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      sentTo: targetEmail,
    });
  } catch (err: any) {
    console.error("[Test Email Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Error al conectar con el servidor SMTP",
      },
      { status: 500 }
    );
  }
}
