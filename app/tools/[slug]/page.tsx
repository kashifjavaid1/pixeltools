import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspace from "@/components/ToolWorkspace";
import ToolCard from "@/components/ToolCard";
import { TOOLS, bySlug } from "@/lib/tools";

export const generateStaticParams = () => TOOLS.map((t) => ({ slug: t.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const t = bySlug(resolvedParams.slug);
  if (!t) return {};
  return { title: `${t.h1} | PixelTools`, description: t.meta };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const t = bySlug(resolvedParams.slug);
  if (!t) notFound();

  const isTextTool = t.slug === "text-to-pdf" || t.from === "text/plain";

  const lossy = t.mode === "compress" || (t.to !== "image/png" && !isTextTool);

  const getFormatFAQ = () => {
    if (isTextTool) {
      return "Plain text (.txt), Markdown (.md), or HTML files up to 25 MB are supported.";
    }
    if (t.from) {
      return `This tool accepts ${t.from === "image/jpeg" ? "JPG" : "PNG"} files up to 25 MB.`;
    }
    return "JPG, PNG and WebP are supported, up to 25 MB. Other formats work if your browser can open them.";
  };

  const faq = [
    [
      "Is this tool free?",
      "Yes. It is free to use and needs no account or registration.",
    ],
    [
      "Are my images uploaded to a server?",
      "No. Processing happens inside your browser, so your image never leaves your device.",
    ],
    [
      "What image formats are supported?",
      getFormatFAQ(),
    ],
    [
      "How much can I reduce an image?",
      isTextTool
        ? "Text to PDF formatting generates crisp vector PDFs. File size depends on embedded fonts and page length."
        : "It depends on the image. Photos usually shrink the most, and already-optimized files shrink less. The result size is shown before you download.",
    ],
    [
      "Does it reduce quality?",
      isTextTool
        ? "No. The generated PDF uses high-quality vector typography, so text remains sharp at any zoom level."
        : lossy
        ? "Lossy formats trade quality for size. Lower settings make smaller files but can show visible artifacts, so check the preview."
        : "PNG is lossless, so pixels are kept as they are. Files can end up larger than the original JPG.",
    ],
    [
      "Can I use this tool on mobile?",
      "Yes. It works in modern mobile browsers, though very large images may be slow on older phones.",
    ],
  ];

  const related = TOOLS.filter(
    (x) => x.slug !== t.slug && (x.category === t.category || x.mode !== "convert")
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link href="/tools" className="hover:text-brand">
          All Tools
        </Link>{" "}
        / {t.name}
      </nav>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
        {t.h1}
      </h1>
      <p className="mb-8 mt-3 text-lg text-slate-600">{t.meta}</p>

      <ToolWorkspace tool={t} />

      <section className="mt-16">
        <h2 className="text-2xl font-bold">How to use</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          <li>
            {isTextTool
              ? "Paste your text or upload a plain text/HTML file onto the input area."
              : "Drop an image onto the upload area, or click to choose one."}
          </li>
          <li>
            {isTextTool
              ? "Choose Auto-Style for automatic formatting or Preserve Design for custom HTML."
              : t.mode === "resize"
              ? "Enter a width and height, or pick a preset."
              : lossy
              ? "Adjust the settings if needed and compare the preview."
              : "Wait a moment while it converts."}
          </li>
          <li>
            {isTextTool
              ? "Preview the PDF layout, then click Download."
              : "Check the file size, then download the result."}
          </li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Why use it</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>Files stay on your device.</li>
          <li>No sign-up and no watermark.</li>
          <li>See the result size before you download.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl bg-white ring-1 ring-slate-200">
          {faq.map(([q, a]) => (
            <details key={q} className="group p-4">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Related tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <ToolCard key={r.slug} tool={r} />
          ))}
        </div>
      </section>
    </div>
  );
}