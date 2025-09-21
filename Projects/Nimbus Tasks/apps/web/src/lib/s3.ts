import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

// Initialize S3 client
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  ...(env.S3_ENDPOINT_URL && {
    endpoint: env.S3_ENDPOINT_URL,
    forcePathStyle: true, // Required for LocalStack
  }),
});

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  fileUrl: string;
}

export async function generateUploadUrl({
  filename,
  contentType,
  fileSize,
}: UploadUrlRequest): Promise<UploadUrlResponse> {
  // Generate unique key with timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const key = `uploads/${timestamp}-${randomString}-${filename}`;

  // Create presigned URL for upload
  const putCommand = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: fileSize,
  });

  const uploadUrl = await getSignedUrl(s3Client, putCommand, {
    expiresIn: 3600, // 1 hour
  });

  // Generate the file URL (for accessing the file after upload)
  const fileUrl = env.S3_ENDPOINT_URL
    ? `${env.S3_ENDPOINT_URL}/${env.S3_BUCKET_NAME}/${key}`
    : `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    uploadUrl,
    key,
    fileUrl,
  };
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const getCommand = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, getCommand, {
    expiresIn: 3600, // 1 hour
  });
}

export function getFileUrlFromKey(key: string): string {
  return env.S3_ENDPOINT_URL
    ? `${env.S3_ENDPOINT_URL}/${env.S3_BUCKET_NAME}/${key}`
    : `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export function extractKeyFromUrl(fileUrl: string): string {
  if (env.S3_ENDPOINT_URL && fileUrl.startsWith(env.S3_ENDPOINT_URL)) {
    return fileUrl.replace(`${env.S3_ENDPOINT_URL}/${env.S3_BUCKET_NAME}/`, "");
  }

  const s3UrlPattern = new RegExp(`https://${env.S3_BUCKET_NAME}\\.s3\\.${env.AWS_REGION}\\.amazonaws\\.com/(.+)`);
  const match = fileUrl.match(s3UrlPattern);
  return match ? match[1] : fileUrl;
}

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: "File type not supported",
    };
  }

  return { valid: true };
}