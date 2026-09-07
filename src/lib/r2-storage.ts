import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Obtener credenciales desde variables de entorno o parámetros opcionales
export function getR2Config() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "procap-natural";
  const publicUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").replace(/\/$/, "");

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
    isConfigured: Boolean(accountId && accessKeyId && secretAccessKey && bucketName),
  };
}

export function createR2Client(customConfig?: {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}) {
  const config = getR2Config();
  const accountId = customConfig?.accountId || config.accountId;
  const accessKeyId = customConfig?.accessKeyId || config.accessKeyId;
  const secretAccessKey = customConfig?.secretAccessKey || config.secretAccessKey;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadFileToR2({
  buffer,
  fileName,
  contentType,
  folder = "media",
  customConfig,
}: {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
  customConfig?: {
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
    publicUrl?: string;
  };
}): Promise<{ url: string; key: string }> {
  const config = getR2Config();
  const bucketName = customConfig?.bucketName || config.bucketName;
  const publicUrl = (customConfig?.publicUrl || config.publicUrl || "").replace(/\/$/, "");

  const client = createR2Client(customConfig);
  if (!client) {
    throw new Error(
      "Cloudflare R2 no está configurado. Por favor define CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID y CLOUDFLARE_R2_SECRET_ACCESS_KEY."
    );
  }

  // Sanitizar nombre de archivo y generar clave única
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const key = `${folder}/${uniquePrefix}-${cleanName}`.replace(/^\/+/, "");

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await client.send(command);

  // URL pública de Cloudflare R2
  const finalUrl = publicUrl
    ? `${publicUrl}/${key}`
    : `https://${bucketName}.${config.accountId}.r2.cloudflarestorage.com/${key}`;

  return { url: finalUrl, key };
}
