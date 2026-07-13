import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { UPLOADS_DIR } from "./image-upload";
import { appRouter } from "./routers";

const createdFiles: string[] = [];

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function toDataUrl(mimeType: string, bytes: number[]): string {
  return `data:${mimeType};base64,${Buffer.from(bytes).toString("base64")}`;
}

afterEach(() => {
  for (const filePath of createdFiles.splice(0)) {
    fs.rmSync(filePath, { force: true });
  }
});

describe("menu.uploadImage", () => {
  it.each([
    {
      mimeType: "image/jpeg",
      extension: "jpg",
      bytes: [0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43],
    },
    {
      mimeType: "image/png",
      extension: "png",
      bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00],
    },
    {
      mimeType: "image/webp",
      extension: "webp",
      bytes: [
        0x52, 0x49, 0x46, 0x46,
        0x04, 0x00, 0x00, 0x00,
        0x57, 0x45, 0x42, 0x50,
      ],
    },
  ])("stores a $extension image and returns its public URL", async ({ mimeType, extension, bytes }) => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.menu.uploadImage({ dataUrl: toDataUrl(mimeType, bytes) });

    expect(result.url).toMatch(new RegExp(`^/uploads/[0-9]+-[0-9a-f-]+\\.${extension}$`));

    const filePath = path.join(UPLOADS_DIR, path.basename(result.url));
    createdFiles.push(filePath);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath)).toEqual(Buffer.from(bytes));
  });

  it("rejects unsupported image formats", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.menu.uploadImage({ dataUrl: toDataUrl("image/gif", [0x47, 0x49, 0x46, 0x38]) })
    ).rejects.toThrow("صيغة الصورة غير مدعومة");
  });

  it("rejects content whose signature does not match its declared format", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.menu.uploadImage({ dataUrl: toDataUrl("image/png", [0xff, 0xd8, 0xff, 0xdb]) })
    ).rejects.toThrow("محتوى الملف لا يطابق صيغة الصورة المحددة");
  });
});
