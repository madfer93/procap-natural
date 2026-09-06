import { NextRequest, NextResponse } from "next/server";
import { getClientIp, checkAdminLoginRateLimit, recordFailedAdminLogin, resetAdminLoginAttempts } from "@/lib/security-service";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const body = await req.json();
    const { action } = body; // 'check' | 'failed' | 'success'

    if (action === "check") {
      const status = checkAdminLoginRateLimit(ip);
      return NextResponse.json(status);
    }

    if (action === "failed") {
      const result = recordFailedAdminLogin(ip);
      const status = checkAdminLoginRateLimit(ip);
      return NextResponse.json({ ...result, ...status });
    }

    if (action === "success") {
      resetAdminLoginAttempts(ip);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno de seguridad" }, { status: 500 });
  }
}
