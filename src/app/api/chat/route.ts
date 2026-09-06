import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, PROCAP_AI_SYSTEM_PROMPT } from "@/lib/groq";

// Modelos soportados en la cuenta de Groq con fallback en cascada
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "groq/compound",
  "llama-3.3-70b-versatile"
];

export async function POST(req: NextRequest) {
  try {
    const { messages, customGroqKey } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "El array de mensajes es requerido" },
        { status: 400 }
      );
    }

    const groq = getGroqClient(customGroqKey);

    // Fallback inteligente simulado si no hay API key configurada
    if (!groq) {
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let simulatedReply = "¡Hola! Soy CapilarBot, asesor de Procap Natural en Bogotá. ";

      if (lastUserMsg.includes("precio") || lastUserMsg.includes("cuanto") || lastUserMsg.includes("costo")) {
        simulatedReply += "Nuestros sistemas capilares van desde $450.000 COP (Entradas Frontales) y $999.000 COP (Sistema Pompadour en oferta) hasta $1.750.000 COP (Sistema Mixto) y $1.950.000 COP (Sistema París). Además, el servicio de instalación completa está en $300.000 COP y el mantenimiento en $75.000 COP. ¿Te gustaría agendar una valoración en Chicó Norte?";
      } else if (lastUserMsg.includes("donde") || lastUserMsg.includes("ubicacion") || lastUserMsg.includes("direccion") || lastUserMsg.includes("bogota")) {
        simulatedReply += "Estamos ubicados en la Carrera 16 #96-64, Barrio Chicó Norte, Bogotá D.C. Atendemos con cita previa para garantizarte máxima privacidad en cabina individual. ¿Deseas apartar tu espacio?";
      } else if (lastUserMsg.includes("mantenimiento") || lastUserMsg.includes("cuidado")) {
        simulatedReply += "El mantenimiento preventivo tiene un valor de $75.000 COP e incluye retiro suave con disolvente cítrico C-22, limpieza profunda de la base, desinfección dérmica, corte lateral y nueva fijación con adhesivo de alta duración. Se recomienda cada 2 a 4 semanas.";
      } else if (lastUserMsg.includes("deporte") || lastUserMsg.includes("piscina") || lastUserMsg.includes("agua") || lastUserMsg.includes("nadar") || lastUserMsg.includes("casco")) {
        simulatedReply += "¡Totalmente seguro! Las prótesis capilares de Procap Natural están fijadas con adhesivos médicos impermeables que resisten el sudor del gimnasio, duchas, piscina y el uso de casco de moto sin desprenderse.";
      } else {
        simulatedReply += "Te ayudamos a recuperar tu cabello y seguridad con prótesis capilares 100% indetectables de cabello humano. Puedes escribirnos directamente a nuestro WhatsApp oficial +57 315 1189795 para una atención inmediata.";
      }

      return NextResponse.json({
        role: "assistant",
        content: simulatedReply
      });
    }

    // Intentar llamadas a Groq iterando por la lista de modelos
    let reply = "";
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: PROCAP_AI_SYSTEM_PROMPT },
            ...messages
          ],
          temperature: 0.6,
          max_tokens: 500,
        });

        reply = completion.choices[0]?.message?.content || "";
        if (reply) {
          break; // Éxito con este modelo
        }
      } catch (err) {
        lastError = err;
        console.warn(`Intento con modelo ${model} falló, probando siguiente...`, err);
      }
    }

    if (!reply) {
      throw lastError || new Error("No se pudo obtener respuesta de ningún modelo de Groq");
    }

    return NextResponse.json({
      role: "assistant",
      content: reply
    });

  } catch (error: any) {
    console.error("Error en Groq AI Route:", error);
    return NextResponse.json(
      { 
        role: "assistant", 
        content: "¡Hola! Estoy experimentando un momento de alta demanda, pero puedes escribirnos directamente a nuestro WhatsApp oficial +57 315 1189795 para atenderte de inmediato." 
      },
      { status: 200 }
    );
  }
}
