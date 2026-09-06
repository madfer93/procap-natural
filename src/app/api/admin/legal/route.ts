import { NextRequest, NextResponse } from "next/server";
import { getLegalDocuments, saveLegalDocuments, DEFAULT_LEGAL_DOCUMENTS } from "@/lib/legal-store";

export async function GET() {
  try {
    const docs = await getLegalDocuments();
    return NextResponse.json({ docs });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar documentos legales" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, docs } = body;

    if (action === "reset") {
      const result = await saveLegalDocuments(DEFAULT_LEGAL_DOCUMENTS);
      return NextResponse.json({ success: result.success, docs: DEFAULT_LEGAL_DOCUMENTS });
    }

    if (!Array.isArray(docs)) {
      return NextResponse.json({ error: "Estructura de documentos inválida" }, { status: 400 });
    }

    const result = await saveLegalDocuments(docs);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, docs });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar documentos legales" }, { status: 500 });
  }
}
