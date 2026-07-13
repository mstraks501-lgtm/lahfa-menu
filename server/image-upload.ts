import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;

const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type AllowedImageMimeType = keyof typeof IMAGE_EXTENSIONS;

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export function ensureUploadsDirectory(): void {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function hasValidImageSignature(buffer: Buffer, mimeType: AllowedImageMimeType): boolean {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === "image/png") {
    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    return buffer.length >= pngSignature.length && buffer.subarray(0, pngSignature.length).equals(pngSignature);
  }

  return (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

export function saveUploadedImage(dataUrl: string): { url: string } {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);

  if (!match) {
    throw new ImageUploadError("صيغة الصورة غير مدعومة. اختر صورة JPG أو PNG أو WEBP.");
  }

  const mimeType = match[1] as AllowedImageMimeType;
  const base64Data = match[2].replace(/\s/g, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  if (imageBuffer.length === 0) {
    throw new ImageUploadError("ملف الصورة فارغ أو غير صالح.");
  }

  if (imageBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new ImageUploadError("حجم الصورة أكبر من 15 ميجابايت.");
  }

  if (!hasValidImageSignature(imageBuffer, mimeType)) {
    throw new ImageUploadError("محتوى الملف لا يطابق صيغة الصورة المحددة.");
  }

  ensureUploadsDirectory();

  const extension = IMAGE_EXTENSIONS[mimeType];
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, fileName);

  fs.writeFileSync(filePath, imageBuffer, { flag: "wx" });

  return { url: `/uploads/${fileName}` };
}
