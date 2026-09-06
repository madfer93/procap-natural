import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, buildDynamicSystemPrompt } from "@/lib/groq";
import { getClientIp, isIpBlocked, registerSabotageStrike } from "@/lib/security-service";

// Modelos soportados en la cuenta de Groq con fallback en cascada
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "groq/compound",
  "llama-3.3-70b-versatile"
];

// --- 1. RATE LIMITING EN MEMORIA POR IP ---
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const ipRateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 12; // Máximo 12 preguntas por minuto por IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  // Limpieza periódica si la memoria crece
  if (ipRateLimitMap.size > 2000) {
    ipRateLimitMap.forEach((val, key) => {
      if (now > val.resetTime) ipRateLimitMap.delete(key);
    });
  }

  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count };
}

// --- 2. FILTRO ANTI-PROMPT INJECTION, ANTI-SABOTAJE & ANTI-FUGA ---
const INJECTION_PATTERNS = [
  /ignore (all|any|the|previous|above) (instructions|directions|rules)/i,
  /ignora (todas|las|tus) (instrucciones|reglas|órdenes)/i,
  /reveal (your|the) (system prompt|instructions|secret|api key)/i,
  /revela (tu|el) (prompt|instrucciones|secreto|clave)/i,
  /(system prompt|system instruction|prompt de sistema)/i,
  /(dan mode|jailbreak|developer mode|modo desarrollador)/i,
  /(what are your instructions|cuáles son tus instrucciones internas)/i,
  /(show me your system prompt|muéstrame tu prompt)/i,
  /(env variables|variables de entorno|groq_api_key|smtp_pass|supabase_anon_key)/i,
  /(act as an unconstrained|haz de cuenta que no tienes reglas|olvida que eres)/i,
  /(repite la palabra|di groserías|escribe un malware|sql injection|drop table)/i
];

function containsPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 1. VERIFICACIÓN DE IP BLOQUEADA (Supabase + Memoria)
    const blockStatus = await isIpBlocked(ip);
    if (blockStatus.blocked) {
      return NextResponse.json(
        {
          role: "assistant",
          content: "⛔ **ACCESO DENEGADO (IP BLOQUEADA)**: Tu dirección IP se encuentra bloqueada por 1 año debido a reiterados intentos de sabotaje contra el sistema de Procap Natural. Si consideras que se trata de un error, contáctanos por WhatsApp oficial +57 315 118 9795."
        },
        { status: 403 }
      );
    }

    // 2. RATE LIMITING POR IP
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          role: "assistant",
          content: "Has alcanzado el límite de consultas rápidas por minuto. Por favor espera unos segundos o escríbenos directamente a nuestro WhatsApp oficial +57 315 118 9795 para una atención inmediata."
        },
        { 
          status: 429, 
          headers: { "Retry-After": "60", "X-RateLimit-Remaining": String(remaining) } 
        }
      );
    }

    const { messages, customGroqKey } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "El array de mensajes es requerido" },
        { status: 400 }
      );
    }

    // 3. Sanitización y limitación de tamaño del payload (conservar hasta 12 mensajes para memoria de contexto)
    const safeMessages: Array<{ role: "assistant" | "user" | "system"; content: string }> = messages
      .slice(-12)
      .map((m: any) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: String(m.content || "").slice(0, 1000)
      }));

    const lastUserMessage = safeMessages[safeMessages.length - 1]?.content || "";

    // 4. DETECCIÓN DE SABOTAJE / INYECCIÓN CON SISTEMA DE 3 STRIKES (2 ADVERTENCIAS + BLOQUEO POR 1 AÑO)
    if (containsPromptInjection(lastUserMessage)) {
      console.warn(`[Security Alert] Sabotaje detectado desde IP ${ip}: "${lastUserMessage.slice(0, 100)}"`);
      const strikeResult = await registerSabotageStrike(ip, userAgent, lastUserMessage.slice(0, 100));

      if (strikeResult.blocked) {
        return NextResponse.json(
          {
            role: "assistant",
            content: strikeResult.message
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        role: "assistant",
        content: strikeResult.message
      });
    }

    const groq = getGroqClient(customGroqKey);

    // Fallback inteligente simulado si no hay API key configurada
    if (!groq) {
      const lastUserMsg = lastUserMessage.toLowerCase();
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
        simulatedReply += "Te ayudamos a recuperar tu cabello y seguridad con prótesis capilares 100% indetectables de cabello humano. Puedes escribirnos directamente a nuestro WhatsApp oficial +57 315 118 9795 para una atención inmediata.";
      }

      return NextResponse.json({
        role: "assistant",
        content: simulatedReply
      });
    }

    // Obtener System Prompt dinámico conectado a la base de datos Supabase
    const systemPrompt = await buildDynamicSystemPrompt();

    // Intentar llamadas a Groq iterando por la lista de modelos con fallback
    let reply = "";
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...safeMessages
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
        content: "¡Hola! Estoy experimentando un momento de alta demanda, pero puedes escribirnos directamente a nuestro WhatsApp oficial +57 315 118 9795 para atenderte de inmediato." 
      },
      { status: 200 }
    );
  }
}
