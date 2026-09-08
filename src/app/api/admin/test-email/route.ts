import { NextRequest, NextResponse } from "next/server";
import { getEmailTransporter } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.to || process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";

    const transporter = getEmailTransporter();
    const senderEmail = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";

    const info = await transporter.sendMail({
      from: `"Procap Natural (Test)" <${senderEmail}>`,
      to: targetEmail,
      subject: `🧪 Correo de Prueba - Procap Natural & Namecheap SMTP`,
      html: `
        <div style="font-family: sans-serif; background: #03122c; color: #fff; padding: 30px; border-radius: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #38bdf8; margin-top: 0;">🎉 ¡Conexión SMTP Exitosa!</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            El servicio de correo de <strong>Procap Natural</strong> está configurado y funcionando correctamente con tu servidor de correo corporativo:
          </p>
          <div style="background: #031C45; padding: 16px; border-radius: 12px; border: 1px solid #1e3a68; font-size: 13px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Buzón Remitente:</strong> ${senderEmail}</p>
            <p style="margin: 4px 0;"><strong>Servidor SMTP:</strong> ${process.env.SMTP_HOST || "mail.privateemail.com"}</p>
            <p style="margin: 4px 0;"><strong>Puerto:</strong> ${process.env.SMTP_PORT || "465"}</p>
            <p style="margin: 4px 0;"><strong>Fecha y Hora:</strong> ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}</p>
          </div>
          <p style="color: #34d399; font-weight: bold; font-size: 13px;">
            ✓ Confirmaciones de Cita automáticas activas.<br>
            ✓ Confirmaciones de Compra Wompi activas.<br>
            ✓ Alertas de Nuevos Leads activas.
          </p>
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
