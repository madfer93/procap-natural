import { supabase, isSupabaseConfigured } from "./supabase";

export interface StrikeResult {
  blocked: boolean;
  strikes: number;
  message: string;
}

export interface AdminRateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockedMinutesRemaining?: number;
}

// --- 1. CACHÉ EN MEMORIA PARA RENDIMIENTO SUB-MILISEGUNDO ---
interface MemoryBlockedEntry {
  blockedUntil: number; // Timestamp en ms
  reason: string;
}

interface MemoryStrikeEntry {
  strikes: number;
  lastAttempt: number;
}

interface MemoryAdminAttemptEntry {
  attempts: number;
  lockedUntil?: number;
  lastAttempt: number;
}

const memoryBlockedIps = new Map<string, MemoryBlockedEntry>();
const memoryStrikes = new Map<string, MemoryStrikeEntry>();
const memoryAdminAttempts = new Map<string, MemoryAdminAttemptEntry>();

const STRIKE_WINDOW_MS = 24 * 60 * 60 * 1000; // Los strikes se recuerdan por 24 horas
const ADMIN_LOCK_DURATION_MS = 15 * 60 * 1000; // Bloqueo de 15 minutos tras fallar
const MAX_ADMIN_ATTEMPTS = 5; // Máximo 5 intentos de login antes de bloqueo temporal

/**
 * Obtiene la dirección IP real del cliente desde los headers HTTP
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Verifica si una dirección IP está bloqueada actualmente (en memoria o en Supabase)
 */
export async function isIpBlocked(ip: string): Promise<{ blocked: boolean; reason?: string; blockedUntil?: Date }> {
  const now = Date.now();

  // 1. Comprobación ultra-rápida en memoria
  const memoryEntry = memoryBlockedIps.get(ip);
  if (memoryEntry) {
    if (now < memoryEntry.blockedUntil) {
      return {
        blocked: true,
        reason: memoryEntry.reason,
        blockedUntil: new Date(memoryEntry.blockedUntil)
      };
    } else {
      memoryBlockedIps.delete(ip); // El bloqueo ya expiró
    }
  }

  // 2. Comprobación en Supabase si está configurado
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("blocked_ips")
        .select("ip, reason, blocked_until, is_permanently_blocked")
        .eq("ip", ip)
        .maybeSingle();

      if (!error && data) {
        const isPermanent = data.is_permanently_blocked;
        const blockedUntil = data.blocked_until ? new Date(data.blocked_until).getTime() : 0;

        if (isPermanent || (blockedUntil && now < blockedUntil)) {
          // Guardar en caché de memoria por 10 minutos
          memoryBlockedIps.set(ip, {
            blockedUntil: isPermanent ? now + 10 * 365 * 24 * 3600 * 1000 : blockedUntil,
            reason: data.reason || "Violación de seguridad y sabotaje"
          });

          return {
            blocked: true,
            reason: data.reason,
            blockedUntil: data.blocked_until ? new Date(data.blocked_until) : undefined
          };
        }
      }
    } catch (err) {
      console.warn("[Security] Error al verificar IP en Supabase:", err);
    }
  }

  return { blocked: false };
}

/**
 * Registra una infracción / intento de sabotaje para una IP con sistema de 3 strikes.
 * - Strike 1: Advertencia formal (1/2)
 * - Strike 2: Advertencia final (2/2)
 * - Strike 3: Bloqueo automático de IP por 1 AÑO (registrado en Supabase)
 */
export async function registerSabotageStrike(
  ip: string,
  userAgent: string = "unknown",
  detectedPattern: string = "Prompt Injection / Sabotaje"
): Promise<StrikeResult> {
  const now = Date.now();
  const currentStrikeData = memoryStrikes.get(ip);

  let newStrikeCount = 1;
  if (currentStrikeData && (now - currentStrikeData.lastAttempt < STRIKE_WINDOW_MS)) {
    newStrikeCount = currentStrikeData.strikes + 1;
  }

  memoryStrikes.set(ip, {
    strikes: newStrikeCount,
    lastAttempt: now
  });

  // --- ESCENARIO 1: PRIMER STRIKE ---
  if (newStrikeCount === 1) {
    return {
      blocked: false,
      strikes: 1,
      message: "⚠️ **Advertencia de Seguridad [1/2]**: Tu mensaje contiene patrones identificados como intento de manipulación o sabotaje. CapilarBot es un asistente exclusivo de prótesis capilares. Por favor realiza consultas relacionadas con el negocio."
    };
  }

  // --- ESCENARIO 2: SEGUNDO STRIKE ---
  if (newStrikeCount === 2) {
    return {
      blocked: false,
      strikes: 2,
      message: "🚨 **Advertencia Final de Seguridad [2/2]**: Has emitido un segundo mensaje no permitido o sospechoso de sabotaje. Si reincides en un próximo mensaje, **tu dirección IP será bloqueada automáticamente por 1 año** de forma irreversible."
    };
  }

  // --- ESCENARIO 3: TERCER STRIKE -> BLOQUEO POR 1 AÑO ---
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  const blockReason = `Sabotaje reiterado (3 strikes alcanzados): ${detectedPattern}`;

  // Actualizar caché de memoria de bloqueo inmediato
  memoryBlockedIps.set(ip, {
    blockedUntil: oneYearFromNow.getTime(),
    reason: blockReason
  });

  // Guardar bloqueo en Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("blocked_ips")
        .upsert({
          ip,
          strikes: newStrikeCount,
          reason: blockReason,
          user_agent: userAgent.slice(0, 300),
          last_attempt_at: new Date().toISOString(),
          blocked_until: oneYearFromNow.toISOString(),
          is_permanently_blocked: false
        }, { onConflict: "ip" });

      console.error(`[SECURITY ALERT] 🛑 IP ${ip} bloqueada por 1 AÑO en base de datos. Motivo: ${blockReason}`);
    } catch (err) {
      console.error("[Security] Error al guardar IP bloqueada en Supabase:", err);
    }
  }

  return {
    blocked: true,
    strikes: newStrikeCount,
    message: "⛔ **ACCESO BLOQUEADO**: Tu dirección IP ha sido bloqueada automáticamente por un periodo de **1 año** debido a reiterados intentos de sabotaje e inyecciones maliciosas. Esta acción es definitiva y queda registrada en el sistema de auditoría."
  };
}

/**
 * Control estricto de intentos de inicio de sesión para el panel de administración
 */
export function checkAdminLoginRateLimit(ip: string): AdminRateLimitResult {
  const now = Date.now();
  const attempt = memoryAdminAttempts.get(ip);

  if (attempt?.lockedUntil && now < attempt.lockedUntil) {
    const minutesRemaining = Math.ceil((attempt.lockedUntil - now) / 60000);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedMinutesRemaining: minutesRemaining
    };
  }

  // Si el bloqueo expiró o es nuevo
  if (attempt?.lockedUntil && now >= attempt.lockedUntil) {
    memoryAdminAttempts.delete(ip);
  }

  const currentCount = attempt ? attempt.attempts : 0;
  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ADMIN_ATTEMPTS - currentCount)
  };
}

/**
 * Registra un intento de login fallido en el panel de administración
 */
export function recordFailedAdminLogin(ip: string): { locked: boolean; lockedMinutesRemaining?: number } {
  const now = Date.now();
  const attempt = memoryAdminAttempts.get(ip);
  const newCount = (attempt ? attempt.attempts : 0) + 1;

  if (newCount >= MAX_ADMIN_ATTEMPTS) {
    const lockedUntil = now + ADMIN_LOCK_DURATION_MS;
    memoryAdminAttempts.set(ip, {
      attempts: newCount,
      lockedUntil,
      lastAttempt: now
    });
    return {
      locked: true,
      lockedMinutesRemaining: Math.ceil(ADMIN_LOCK_DURATION_MS / 60000)
    };
  }

  memoryAdminAttempts.set(ip, {
    attempts: newCount,
    lastAttempt: now
  });

  return { locked: false };
}

/**
 * Limpia los intentos fallidos tras un login exitoso
 */
export function resetAdminLoginAttempts(ip: string) {
  memoryAdminAttempts.delete(ip);
}
