import { NextRequest, NextResponse } from "next/server";
import { uploadFileToR2, getR2Config } from "@/lib/r2-storage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "media";

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo para subir." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name || "upload";
    const contentType = file.type || "application/octet-stream";
    const fileSize = buffer.length;

    // 1. Intentar subir primero a Cloudflare R2
    const r2Config = getR2Config();
    if (r2Config.isConfigured) {
      try {
        const { url, key } = await uploadFileToR2({
          buffer,
          fileName,
          contentType,
          folder,
        });

        return NextResponse.json({
          success: true,
          provider: "cloudflare_r2",
          url,
          key,
          fileName,
          size: fileSize,
          contentType,
        });
      } catch (r2Error: any) {
        console.error("Error al subir a Cloudflare R2, intentando fallback:", r2Error);
      }
    }

    // 2. Fallback: Supabase Storage
    if (isSupabaseConfigured()) {
      try {
        const fileExt = fileName.split(".").pop() || "bin";
        const cleanExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${cleanExt}`;
        const filePath = `${folder}/${uniqueName}`;

        const bucketName = "products";
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, buffer, {
            contentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          return NextResponse.json({
            success: true,
            provider: "supabase",
            url: publicUrlData.publicUrl,
            key: filePath,
            fileName,
            size: fileSize,
            contentType,
          });
        }
      } catch (supabaseError) {
        console.error("Error al subir a Supabase Storage:", supabaseError);
      }
    }

    // 3. Fallback Local para desarrollo
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads", folder);
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const fileExt = fileName.split(".").pop() || "bin";
      const uniqueLocalName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const localFilePath = path.join(publicUploadsDir, uniqueLocalName);

      fs.writeFileSync(localFilePath, buffer);
      const localUrl = `/uploads/${folder}/${uniqueLocalName}`;

      return NextResponse.json({
        success: true,
        provider: "local",
        url: localUrl,
        key: `${folder}/${uniqueLocalName}`,
        fileName,
        size: fileSize,
        contentType,
      });
    } catch (localError: any) {
      return NextResponse.json(
        {
          error: `Error al guardar archivo: ${localError.message || localError}`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error general en /api/upload:", error);
    return NextResponse.json(
      { error: error.message || "Error interno al procesar el archivo." },
      { status: 500 }
    );
  }
}
