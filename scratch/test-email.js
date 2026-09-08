const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Parse .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key) process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

async function main() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || "admin@protesiscapilarcolombia.com";
  const pass = process.env.SMTP_PASS;

  console.log("Configuración Detectada:", {
    host,
    port,
    user,
    hasPass: Boolean(pass && pass.length > 0),
    passLength: pass ? pass.length : 0
  });

  if (!pass) {
    console.log("----------------------------------------------------------------");
    console.log("⚠️ AVISO: La variable SMTP_PASS está vacía en .env.local.");
    console.log("Para que el servidor de Namecheap autorice el envío real a admin@jymtechsolutions.online,");
    console.log("se requiere la contraseña que le asignaste al buzón admin@protesiscapilarcolombia.com.");
    console.log("----------------------------------------------------------------");
    return;
  }

  console.log("Intentando conectar con Namecheap Private Email...");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Procap Natural" <${user}>`,
      to: "admin@jymtechsolutions.online",
      subject: "🧪 Prueba de Correo Transaccional - Procap Natural",
      html: `
        <div style="font-family: Arial, sans-serif; background: #03122c; color: #fff; padding: 30px; border-radius: 16px; max-width: 500px; margin: auto;">
          <h2 style="color: #38bdf8;">🎉 ¡Prueba de Correo Exitosa!</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Este es un correo de prueba enviado desde <strong>Procap Natural</strong>.</p>
          <div style="background: #031C45; padding: 15px; border-radius: 10px; border: 1px solid #1e3a68; margin: 15px 0;">
            <p style="margin: 4px 0;"><strong>Buzón Remitente:</strong> ${user}</p>
            <p style="margin: 4px 0;"><strong>Servidor SMTP:</strong> ${host}:${port}</p>
            <p style="margin: 4px 0;"><strong>Destinatario:</strong> admin@jymtechsolutions.online</p>
          </div>
          <p style="color: #34d399; font-weight: bold;">✓ El sistema de envíos automáticos está 100% operativo.</p>
        </div>
      `
    });
    console.log("✅ ¡Correo enviado exitosamente! MessageId:", info.messageId);
  } catch (err) {
    console.error("❌ Error de autenticación o conexión SMTP:", err.message);
  }
}

main();
