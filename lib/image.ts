export type OutType = "image/jpeg" | "image/png" | "image/webp";
export const MAX_BYTES = 25 * 1024 * 1024;
export const EXT: Record<OutType, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const fmt = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`);

export function validate(f: File, from?: string): string | null {
  if (!f.size) return "That file is empty. Please choose another image.";
  if (!f.type.startsWith("image/")) return "Please select a JPG, PNG or WebP image.";
  if (from && f.type !== from) return `This tool needs a ${from === "image/jpeg" ? "JPG" : "PNG"} image.`;
  if (f.size > MAX_BYTES) return "That image is larger than 25 MB. Please choose a smaller one.";
  return null;
}
export async function readSize(f: File) {
  try { const b = await createImageBitmap(f); const s = { w: b.width, h: b.height }; b.close(); return s; }
  catch { throw new Error("We couldn't read that image. It may be damaged or in an unsupported format."); }
}
export async function render(file: File, o: { type: OutType; quality?: number; width?: number; height?: number }): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const w = o.width ?? bmp.width, h = o.height ?? bmp.height;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Your browser can't process images here. Please try a recent Chrome, Firefox, Safari or Edge.");
  if (o.type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
  ctx.imageSmoothingQuality = "high"; ctx.drawImage(bmp, 0, 0, w, h); bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, o.type, o.quality));
  if (!blob || blob.type !== o.type) throw new Error("This browser can't create that format. Please try another browser.");
  return blob;
}
