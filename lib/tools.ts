import type { OutType } from "./image";
export type Category = "Compress" | "Resize" | "Convert";
export interface Tool { slug: string; name: string; desc: string; h1: string; meta: string; category: Category;
  mode: "compress" | "resize" | "convert"; from?: string; to?: OutType; icon: string; }
const conv = (slug: string, name: string, fromN: string, toN: string, from: string, to: OutType, desc: string): Tool => ({
  slug, name, desc, h1: `${name}: Convert ${fromN} to ${toN} Online`, category: "Convert", mode: "convert", from, to, icon: "⇄",
  meta: `Convert ${fromN} images to ${toN} in your browser. Free, private, and nothing is uploaded.` });
export const TOOLS: Tool[] = [
  { slug: "image-compressor", name: "Image Compressor", desc: "Reduce image file size while keeping great quality.", h1: "Compress Images Online for Free",
    meta: "Reduce JPG, PNG and WebP image sizes directly in your browser without uploading your files.", category: "Compress", mode: "compress", icon: "⇣" },
  { slug: "image-resizer", name: "Image Resizer", desc: "Resize images to exact dimensions in seconds.", h1: "Resize Images Online for Free",
    meta: "Resize images to exact pixel dimensions or social media presets, right in your browser.", category: "Resize", mode: "resize", icon: "⤢" },
  conv("jpg-to-png", "JPG to PNG", "JPG", "PNG", "image/jpeg", "image/png", "Convert JPG images to PNG format instantly."),
  conv("png-to-jpg", "PNG to JPG", "PNG", "JPG", "image/png", "image/jpeg", "Convert PNG images to JPG format quickly."),
  conv("jpg-to-webp", "JPG to WebP", "JPG", "WebP", "image/jpeg", "image/webp", "Convert JPG images into smaller WebP files."),
  conv("png-to-webp", "PNG to WebP", "PNG", "WebP", "image/png", "image/webp", "Convert PNG images to modern WebP format."),
];
export const bySlug = (s: string) => TOOLS.find((t) => t.slug === s);
