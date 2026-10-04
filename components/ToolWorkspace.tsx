"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tool } from "@/lib/tools";
import { EXT, OutType, fmt, readSize, render, validate } from "@/lib/image";

const PRESETS = [
  ["Instagram Post", 1080, 1080],
  ["Instagram Story", 1080, 1920],
  ["YouTube Thumbnail", 1280, 720],
  ["Facebook Cover", 820, 312],
  ["LinkedIn Post", 1200, 627],
] as const;

type Out = { blob: Blob; url: string };

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Minimal",
    accent: "#2563eb",
    bg: "#ffffff",
    color: "#1e293b",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "32px",
    borderTop: "",
    borderLeft: "",
  },
  {
    id: "corporate",
    name: "Corporate Blue",
    accent: "#1e40af",
    bg: "#ffffff",
    color: "#0f172a",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "32px",
    borderTop: "8px solid #1e40af",
    borderLeft: "",
  },
  {
    id: "elegant",
    name: "Elegant Serif",
    accent: "#92400e",
    bg: "#fefbf3",
    color: "#1c1917",
    fontFamily: "Georgia, 'Times New Roman', serif",
    padding: "40px",
    borderTop: "",
    borderLeft: "",
  },
  {
    id: "creative",
    name: "Creative Amber",
    accent: "#d97706",
    bg: "#ffffff",
    color: "#1e293b",
    fontFamily: "Arial, Helvetica, sans-serif",
    padding: "32px",
    borderTop: "",
    borderLeft: "8px solid #f59e0b",
  },
];

type PdfLayout = "presentation" | "original" | "auto";
type TextAlign = "left" | "center" | "right" | "justify";

export default function ToolWorkspace({ tool }: { tool: Tool }) {
  const [textInput, setTextInput] = useState("");
  const [pdfLayout, setPdfLayout] = useState<PdfLayout>("auto");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragText, setDragText] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [presTitle, setPresTitle] = useState("");
  const [presSubtitle, setPresSubtitle] = useState("");

  const [textAlign, setTextAlign] = useState<TextAlign>("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const [textColor, setTextColor] = useState("#1e293b");
  const [lineHeight, setLineHeight] = useState(1.7);

  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState("");
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [q, setQ] = useState(80);
  const [lock, setLock] = useState(true);
  const [out, setOut] = useState<Out | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const input = useRef<HTMLInputElement>(null);

  if (tool.slug === "text-to-pdf") {
    const loadScript = (src: string, check: () => any): Promise<any> =>
      new Promise((resolve, reject) => {
        if (check()) return resolve(check());
        const el = document.createElement("script");
        el.src = src;
        el.onload = () => resolve(check());
        el.onerror = () => reject(new Error("Failed to load: " + src));
        document.body.appendChild(el);
      });

    const handleFileUpload = (f?: File) => {
      if (!f) return;
      setFileName(f.name);
      setFileUploaded(true);

      if (f.name.endsWith(".html") || f.name.endsWith(".htm")) {
        setPdfLayout("original");
      } else if (f.name.endsWith(".txt")) {
        setPdfLayout("original");
      } else {
        setPdfLayout("auto");
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          setTextInput(content);
          const firstLine = content.split("\n").find((l) => l.trim());
          if (firstLine && !presTitle) {
            setPresTitle(firstLine.substring(0, 60).trim());
          }
        }
      };
      reader.readAsText(f);
    };

    const buildPresentationHTML = () => {
      const slides = textInput
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const title =
        presTitle || fileName.replace(/\.[^/.]+$/, "") || "Presentation";

      return `
        <div style="padding:32px; font-family:${selectedTemplate.fontFamily}; background:#ffffff;">
          <div style="text-align:center; margin-bottom:36px; padding-bottom:18px; border-bottom:3px solid #1e40af;">
            <h1 style="font-size:28px; color:#0f172a; margin:0 0 8px 0; font-weight:bold; letter-spacing:-0.5px;">
              ${title.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </h1>
            ${
              presSubtitle
                ? `<p style="font-size:14px; color:#64748b; margin:0;">${presSubtitle
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</p>`
                : ""
            }
          </div>
          ${slides
            .map(
              (slide, i) => `
            <div class="avoid-break" style="
              margin-bottom:20px;
              padding:18px 22px;
              background:#f8fafc;
              border-left:5px solid #1e40af;
              border-radius:8px;
            ">
              <div style="
                font-size:10px;
                font-weight:bold;
                color:#1e40af;
                margin-bottom:10px;
                letter-spacing:2px;
                text-transform:uppercase;
              ">
                ● Slide ${i + 1}
              </div>
              <div style="
                font-size:${fontSize}px;
                color:${textColor};
                line-height:${lineHeight};
                text-align:${textAlign};
                ${isBold ? "font-weight:bold;" : ""}
                ${isItalic ? "font-style:italic;" : ""}
                white-space:pre-wrap;
                word-break:break-word;
              ">${slide.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    };

    const buildOriginalHTML = () => {
      const isHtml = fileName.endsWith(".html") || fileName.endsWith(".htm");

      if (isHtml) {
        return `<div style="padding:20px; font-family:Arial, sans-serif; background:#ffffff;">${textInput}</div>`;
      }

      return `
        <div style="
          padding:28px;
          font-family:'Courier New', Courier, monospace;
          font-size:${fontSize}px;
          line-height:${lineHeight};
          color:${textColor};
          white-space:pre-wrap;
          word-break:break-word;
          tab-size:4;
          -moz-tab-size:4;
          background:#ffffff;
          ${isBold ? "font-weight:bold;" : ""}
          ${isItalic ? "font-style:italic;" : ""}
        ">${textInput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      `;
    };

    const buildAutoHTML = () => {
      const t = selectedTemplate;
      return `
        <div style="
          padding:${t.padding};
          background:${t.bg};
          color:${t.color};
          font-family:${t.fontFamily};
          font-size:${fontSize}px;
          line-height:${lineHeight};
          text-align:${textAlign};
          ${t.borderTop ? `border-top:${t.borderTop};` : ""}
          ${t.borderLeft ? `border-left:${t.borderLeft};` : ""}
          ${isBold ? "font-weight:bold;" : ""}
          ${isItalic ? "font-style:italic;" : ""}
        ">
          <div style="
            white-space:pre-wrap;
            word-break:break-word;
            color:${textColor};
          ">${textInput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </div>
      `;
    };

    const handleDownloadPDF = async () => {
      if (!textInput.trim() && !fileUploaded) {
        alert("Please enter text or upload a file first.");
        return;
      }

      let iframe: HTMLIFrameElement | null = null;

      try {
        setPdfLoading(true);

        const [html2canvas, JsPDF] = await Promise.all([
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
            () => (window as any).html2canvas
          ),
          loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
            () => (window as any).jspdf?.jsPDF
          ),
        ]);

        const html =
          pdfLayout === "presentation"
            ? buildPresentationHTML()
            : pdfLayout === "original"
            ? buildOriginalHTML()
            : buildAutoHTML();

        iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
          position: "fixed",
          left: "-10000px",
          top: "0",
          width: "794px",
          height: "1123px",
          border: "0",
          opacity: "0",
          pointerEvents: "none",
          background: "#ffffff",
        });
        iframe.setAttribute("aria-hidden", "true");
        iframe.tabIndex = -1;
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument!;
        doc.open();
        doc.write(
          `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;padding:0;background:#ffffff}body{width:794px;color:#000000}</style></head><body>${html}</body></html>`
        );
        doc.close();

        await new Promise((r) => setTimeout(r, 400));

        const body = doc.body;
        const fullHeight = Math.max(
          Math.ceil(body.getBoundingClientRect().height),
          body.scrollHeight,
          100
        );
        iframe.style.height = fullHeight + "px";
        await new Promise((r) => setTimeout(r, 100));

        const scale = Math.min(2, 30000 / fullHeight);
        const canvas: HTMLCanvasElement = await html2canvas(body, {
          scale,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          width: 794,
          height: fullHeight,
          windowWidth: 794,
          windowHeight: fullHeight,
        });

        if (!canvas.width || !canvas.height) {
          throw new Error("Rendered page is empty.");
        }

        const pdf = new JsPDF({
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        });

        const margin = 10;
        const contentW = 210 - margin * 2;
        const contentH = 297 - margin * 2;
        const pxPerMm = canvas.width / contentW;
        const sliceH = Math.floor(contentH * pxPerMm);

        let y = 0;
        let page = 0;
        while (y < canvas.height) {
          const h = Math.min(sliceH, canvas.height - y);
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = h;
          const ctx = slice.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, slice.width, h);
          ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);

          if (page > 0) pdf.addPage();
          pdf.addImage(
            slice.toDataURL("image/jpeg", 0.95),
            "JPEG",
            margin,
            margin,
            contentW,
            h / pxPerMm
          );
          y += h;
          page++;
        }

        pdf.save(
          fileName ? `${fileName.replace(/\.[^/.]+$/, "")}.pdf` : "document.pdf"
        );
      } catch (e) {
        console.error("PDF Export Error:", e);
        alert("Failed to generate PDF: " + (e as Error).message);
      } finally {
        if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
        setPdfLoading(false);
      }
    };

    return (
      <section
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
        aria-labelledby="text-to-pdf-heading"
      >
        <h2 id="text-to-pdf-heading" className="sr-only">
          Convert Text or File to PDF
        </h2>

        <article aria-labelledby="step-upload-heading">
          <h3
            id="step-upload-heading"
            className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Step 1: Upload Your File
          </h3>
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload or drop a text, HTML, or code file"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              fileInputRef.current?.click()
            }
            onDragOver={(e) => {
              e.preventDefault();
              setDragText(true);
            }}
            onDragLeave={() => setDragText(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragText(false);
              if (e.dataTransfer.files?.[0])
                handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`mb-6 flex cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed p-4 transition-all ${
              dragText
                ? "border-brand bg-brand-soft"
                : fileUploaded
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-slate-200 bg-slate-50/60 hover:border-brand"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg ${
                  fileUploaded
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-brand-soft text-brand"
                }`}
              >
                {fileUploaded ? "✓" : "📄"}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {fileUploaded
                    ? `File Uploaded: ${fileName}`
                    : "Upload or Drop a File"}
                </p>
                <p className="text-xs text-slate-500">
                  {fileUploaded
                    ? "Change layout below and download PDF"
                    : "Supports .txt, .html, .md, .json, .js, .css"}
                </p>
              </div>
            </div>
            <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand shadow-sm border border-slate-200">
              {fileUploaded ? "Change File" : "Browse File"}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.html,.htm,.md,.json,.js,.css"
              className="hidden"
              aria-label="Choose file to convert"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
            />
          </div>
        </article>

        <article aria-labelledby="step-layout-heading">
          <h3
            id="step-layout-heading"
            className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Step 2: Choose PDF Layout
          </h3>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                id: "presentation",
                label: "Presentation",
                icon: "🎯",
                desc: "Slides-style PDF with title & sections",
              },
              {
                id: "original",
                label: "Original File (As-It-Is)",
                icon: "📄",
                desc: "Keep exact layout — no changes applied",
              },
              {
                id: "auto",
                label: "Auto Design",
                icon: "🎨",
                desc: "4 beautiful templates + formatting",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPdfLayout(opt.id as PdfLayout)}
                aria-pressed={pdfLayout === opt.id}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  pdfLayout === opt.id
                    ? "border-brand ring-2 ring-brand/20 bg-white shadow-sm"
                    : "border-slate-200 bg-slate-50/50 hover:bg-white"
                }`}
              >
                <div className="text-2xl" aria-hidden="true">
                  {opt.icon}
                </div>
                <p className="mt-1.5 text-sm font-bold text-slate-800">
                  {opt.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </article>

        {(fileUploaded || textInput.trim()) && (
          <article aria-labelledby="step-design-heading">
            <h3
              id="step-design-heading"
              className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Step 3: Customize Your PDF
            </h3>

            {pdfLayout === "presentation" && (
              <div className="mb-6 space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Presentation Title
                  <input
                    type="text"
                    value={presTitle}
                    onChange={(e) => setPresTitle(e.target.value)}
                    placeholder="e.g., Q4 Sales Report"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:bg-white focus:outline-none"
                  />
                </label>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subtitle (optional)
                  <input
                    type="text"
                    value={presSubtitle}
                    onChange={(e) => setPresSubtitle(e.target.value)}
                    placeholder="e.g., Annual Review 2025"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold focus:border-brand focus:bg-white focus:outline-none"
                  />
                </label>
              </div>
            )}

            {pdfLayout === "auto" && (
              <div className="mb-6">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Design Template
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tmpl)}
                      aria-pressed={selectedTemplate.id === tmpl.id}
                      aria-label={`Select template: ${tmpl.name}`}
                      className={`rounded-2xl border p-3 text-left transition-all ${
                        selectedTemplate.id === tmpl.id
                          ? "border-brand ring-2 ring-brand/20 bg-white shadow-sm"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white"
                      }`}
                    >
                      <p
                        className="text-xs font-bold"
                        style={{ color: tmpl.accent }}
                      >
                        {tmpl.name}
                      </p>
                      <div
                        className="mt-2 h-8 rounded-lg bg-slate-100 p-1"
                        aria-hidden="true"
                      >
                        <div
                          className="h-1.5 w-3/4 rounded"
                          style={{ background: tmpl.accent, opacity: 0.5 }}
                        />
                        <div className="mt-1 h-1.5 w-1/2 rounded bg-slate-200" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Basic Formatting
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    Text Alignment
                  </label>
                  <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
                    {(
                      [
                        { v: "left", icon: "⬅", label: "Left" },
                        { v: "center", icon: "⬌", label: "Center" },
                        { v: "right", icon: "➡", label: "Right" },
                        { v: "justify", icon: "☰", label: "Justify" },
                      ] as const
                    ).map((a) => (
                      <button
                        key={a.v}
                        type="button"
                        onClick={() => setTextAlign(a.v)}
                        title={a.label}
                        aria-label={`Align text ${a.label.toLowerCase()}`}
                        aria-pressed={textAlign === a.v}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                          textAlign === a.v
                            ? "bg-brand text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span aria-hidden="true">{a.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    Text Style
                  </label>
                  <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setIsBold(!isBold)}
                      aria-label="Toggle bold text"
                      aria-pressed={isBold}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                        isBold
                          ? "bg-brand text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsItalic(!isItalic)}
                      aria-label="Toggle italic text"
                      aria-pressed={isItalic}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold italic transition ${
                        isItalic
                          ? "bg-brand text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      I
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    Font Size: <span className="text-brand">{fontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min={8}
                    max={24}
                    value={fontSize}
                    aria-label="Font size"
                    onChange={(e) => setFontSize(+e.target.value)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    Line Spacing:{" "}
                    <span className="text-brand">{lineHeight.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={2.5}
                    step={0.1}
                    value={lineHeight}
                    aria-label="Line spacing"
                    onChange={(e) => setLineHeight(+e.target.value)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    Text Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      "#1e293b",
                      "#0f172a",
                      "#1e40af",
                      "#dc2626",
                      "#16a34a",
                      "#d97706",
                      "#7c3aed",
                      "#64748b",
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTextColor(c)}
                        aria-label={`Set text color ${c}`}
                        aria-pressed={textColor === c}
                        className={`h-7 w-7 rounded-full border-2 transition ${
                          textColor === c
                            ? "border-brand scale-110"
                            : "border-slate-200"
                        }`}
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      aria-label="Pick custom text color"
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-7 w-10 cursor-pointer rounded border border-slate-200"
                      title="Custom color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {pdfLayout !== "original" && (
          <div className="mb-6 space-y-2">
            <label
              htmlFor="pdf-content-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              {pdfLayout === "presentation"
                ? "Content (separate slides with a blank line)"
                : "Content Editor"}
            </label>
            <textarea
              id="pdf-content-input"
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                pdfLayout === "presentation"
                  ? "Slide 1 content here...\n\nSlide 2 content here...\n\nSlide 3 content here..."
                  : "Type text here or upload a file above..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/30 p-4 text-sm text-slate-800 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        )}

        {(fileUploaded || textInput.trim()) && (
          <aside
            className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            aria-labelledby="live-preview-heading"
          >
            <h4
              id="live-preview-heading"
              className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Live Preview
            </h4>
            <div className="max-h-72 overflow-y-auto rounded-xl border bg-white p-4">
              {pdfLayout === "presentation" ? (
                <div>
                  <h5 className="text-center text-lg font-bold text-slate-800 border-b-2 border-blue-600 pb-3 mb-4">
                    {presTitle ||
                      fileName.replace(/\.[^/.]+$/, "") ||
                      "Presentation"}
                  </h5>
                  {presSubtitle && (
                    <p className="text-center text-xs text-slate-500 mb-4">
                      {presSubtitle}
                    </p>
                  )}
                  {textInput
                    .split(/\n\s*\n/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((slide, i) => (
                      <div
                        key={i}
                        className="mb-3 rounded-lg border-l-4 border-blue-600 bg-slate-50 p-3"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                          ● Slide {i + 1}
                        </p>
                        <p
                          className="mt-1 whitespace-pre-wrap"
                          style={{
                            fontSize: `${fontSize}px`,
                            color: textColor,
                            textAlign: textAlign,
                            lineHeight: lineHeight,
                            fontWeight: isBold ? "bold" : "normal",
                            fontStyle: isItalic ? "italic" : "normal",
                          }}
                        >
                          {slide}
                        </p>
                      </div>
                    ))}
                </div>
              ) : pdfLayout === "original" ? (
                <pre
                  className="whitespace-pre-wrap font-mono"
                  style={{
                    fontSize: `${fontSize}px`,
                    color: textColor,
                    lineHeight: lineHeight,
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                  }}
                >
                  {textInput || "Upload a file to see preview..."}
                </pre>
              ) : (
                <div
                  style={{
                    background: selectedTemplate.bg,
                    color: textColor,
                    fontFamily: selectedTemplate.fontFamily,
                    padding: selectedTemplate.padding,
                    fontSize: `${fontSize}px`,
                    textAlign: textAlign,
                    lineHeight: lineHeight,
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                    borderTop: selectedTemplate.borderTop || undefined,
                    borderLeft: selectedTemplate.borderLeft || undefined,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {textInput || "Type something to see preview..."}
                </div>
              )}
            </div>
          </aside>
        )}

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={pdfLoading || (!textInput.trim() && !fileUploaded)}
          aria-label="Download generated PDF"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pdfLoading ? "Generating PDF..." : "Download PDF"}
        </button>
      </section>
    );
  }

  const type: OutType | null = !file
    ? null
    : tool.to ??
      (tool.mode === "compress"
        ? file.type === "image/jpeg"
          ? "image/jpeg"
          : "image/webp"
        : ["image/jpeg", "image/webp"].includes(file.type)
        ? (file.type as OutType)
        : "image/png");

  const lossy = type !== "image/png";

  async function pick(f?: File) {
    if (!f) return setErr("No file was selected. Please choose an image.");
    const v = validate(f, tool.from);
    if (v) return setErr(v);
    try {
      const s = await readSize(f);
      setErr("");
      setDim(s);
      setSize(s);
      setFile(f);
      setSrc((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(f);
      });
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  function reset() {
    setFile(null);
    setOut(null);
    setErr("");
    setQ(80);
    setPreviewOpen(false);
    setSrc((o) => {
      if (o) URL.revokeObjectURL(o);
      return "";
    });
    setOut((o) => {
      if (o) URL.revokeObjectURL(o.url);
      return null;
    });
    if (input.current) input.current.value = "";
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      pick(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    if (!file || !type) return;
    let dead = false;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const blob = await render(file, {
          type,
          quality: lossy ? q / 100 : undefined,
          ...(tool.mode === "resize" ? { width: size.w, height: size.h } : {}),
        });
        if (dead) return;
        setOut((o) => {
          if (o) URL.revokeObjectURL(o.url);
          return { blob, url: URL.createObjectURL(blob) };
        });
        setErr("");
      } catch (e) {
        if (!dead)
          setErr(
            (e as Error).message ||
              "Something went wrong while processing. Please try again."
          );
      } finally {
        if (!dead) setBusy(false);
      }
    }, 200);
    return () => {
      dead = true;
      clearTimeout(t);
    };
  }, [file, q, size, type, lossy, tool.mode]);

  const setW = (w: number) =>
    setSize({ w, h: lock ? Math.round((w * dim.h) / dim.w) : size.h });
  const setH = (h: number) =>
    setSize({ h, w: lock ? Math.round((h * dim.w) / dim.h) : size.w });

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20";

  if (!file)
    return (
      <section className="w-full" aria-labelledby="image-upload-heading">
        <h2 id="image-upload-heading" className="sr-only">
          Upload Image
        </h2>
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image — drop file or click to browse"
          onClick={() => input.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && input.current?.click()
          }
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-16 ${
            drag
              ? "scale-[1.01] border-brand bg-brand-soft shadow-xl shadow-brand/10"
              : "border-slate-300 bg-white hover:border-brand hover:bg-slate-50/50 hover:shadow-xl hover:shadow-slate-200/50"
          }`}
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white"
            aria-hidden="true"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </div>
          <p className="mt-5 text-xl font-bold text-slate-900">
            Drop your image here
          </p>
          <p className="mt-1 text-sm text-slate-600">
            or click to browse from device
          </p>
          <p className="mt-4 text-xs font-medium text-slate-400">
            {tool.from
              ? tool.from === "image/jpeg"
                ? "JPG"
                : "PNG"
              : "JPG, PNG, WebP and other common formats"}{" "}
            · up to 25 MB
          </p>
          <input
            ref={input}
            type="file"
            accept={tool.from ?? "image/*"}
            className="sr-only"
            aria-label="Choose image file"
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </div>
        <p className="mt-3 text-center text-xs font-medium text-slate-500">
          🔒 Your images are processed locally in your browser.
        </p>
        {err && (
          <p
            role="alert"
            className="mt-4 rounded-2xl bg-red-50 p-4 text-center text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-500/20"
          >
            {err}
          </p>
        )}
      </section>
    );

  const red = out ? Math.round((1 - out.blob.size / file.size) * 100) : 0;
  const base = file.name.replace(/\.[^.]+$/, "");

  return (
    <section
      className="rise rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
      aria-labelledby="image-tool-heading"
    >
      <h2 id="image-tool-heading" className="sr-only">
        {tool.name || "Image Tool"} Workspace
      </h2>

      {tool.mode !== "resize" && lossy && (
        <div className="mb-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-200/60">
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="q" className="text-sm font-bold text-slate-800">
              Compression Quality
            </label>
            <span className="rounded-lg bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
              {q}%
            </span>
          </div>
          <input
            id="q"
            type="range"
            min={10}
            max={100}
            value={q}
            aria-label="Compression quality"
            onChange={(e) => setQ(+e.target.value)}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brand"
          />
          <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
            <span>High Compression (Smaller)</span>
            <span>Balanced (80% Recommended)</span>
            <span>Maximum Quality</span>
          </div>
        </div>
      )}

      {tool.mode === "resize" && (
        <div className="mb-8 space-y-5 rounded-2xl bg-slate-50 p-5 ring-1 ring-inset ring-slate-200/60">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Width (px)
              <input
                type="number"
                min={1}
                max={8000}
                value={size.w || ""}
                aria-label="Target width in pixels"
                onChange={(e) => setW(Math.max(1, +e.target.value))}
                className={`${inputClass} mt-1.5`}
              />
            </label>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Height (px)
              <input
                type="number"
                min={1}
                max={8000}
                value={size.h || ""}
                aria-label="Target height in pixels"
                onChange={(e) => setH(Math.max(1, +e.target.value))}
                className={`${inputClass} mt-1.5`}
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={lock}
              onChange={(e) => setLock(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand accent-brand"
            />
            Lock aspect ratio
          </label>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(([n, w, h]) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSize({ w, h })}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand hover:bg-brand-soft hover:text-brand active:scale-95"
                >
                  {n}{" "}
                  <span className="ml-1 text-slate-400 font-normal">
                    {w}×{h}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <figure className="group">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/70 shadow-inner">
            <span className="absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
              Original
            </span>
            <Image
              src={src}
              alt={`Original uploaded image preview — ${file.name}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain p-2"
            />
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{fmt(file.size)}</span>
            <span>
              {dim.w} × {dim.h} px
            </span>
          </figcaption>
        </figure>

        <figure className="group">
          <div
            onClick={() => out && setPreviewOpen(true)}
            className={`relative h-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/70 shadow-inner transition-all duration-200 ${
              out ? "cursor-pointer hover:border-brand/60 hover:shadow-md" : ""
            }`}
          >
            <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Output
            </span>

            {out && (
              <>
                <Image
                  src={out.url}
                  alt={`Processed ${tool.name || "image"} result preview`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain p-2 transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="rounded-xl bg-slate-900/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs">
                    🔍 Click for Full Preview
                  </span>
                </div>
              </>
            )}

            {busy && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs"
                aria-live="polite"
              >
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                <span className="mt-2 text-xs font-semibold text-slate-600">
                  Processing...
                </span>
              </div>
            )}
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{out ? fmt(out.blob.size) : "Calculating..."}</span>
            <span>
              {tool.mode === "resize"
                ? `${size.w} × ${size.h} px`
                : `${dim.w} × ${dim.h} px`}
            </span>
          </figcaption>
        </figure>
      </div>

      {out && !busy && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ring-1 ring-inset transition-all ${
            red > 0
              ? "bg-emerald-50 text-emerald-800 ring-emerald-500/20"
              : red < 0
              ? "bg-amber-50 text-amber-900 ring-amber-500/30"
              : "bg-blue-50 text-blue-800 ring-blue-500/20"
          }`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              red > 0
                ? "bg-emerald-200/80 text-emerald-800"
                : red < 0
                ? "bg-amber-200/80 text-amber-900"
                : "bg-blue-200/80 text-blue-800"
            }`}
            aria-hidden="true"
          >
            {red > 0 ? "✓" : red < 0 ? "⚠️" : "ℹ️"}
          </div>
          <div>
            <p>
              {red > 0
                ? `Reduced by ${red}%`
                : red < 0
                ? `File size increased by ${-red}% (Try setting quality around 80%)`
                : "Same size as original"}
            </p>
            <p className="text-xs font-normal opacity-80">
              {fmt(file.size)} → {fmt(out.blob.size)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {out && type && (
          <Link
            href={out.url}
            download={`${base}-pixeltools.${EXT[type]}`}
            rel="noopener"
            aria-label={`Download processed image as ${EXT[type].toUpperCase()}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark active:scale-95"
          >
            Download Image
          </Link>
        )}
        {out && (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            aria-label="Open full preview"
            className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            🔍 Preview Quality
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          aria-label="Reset and start over"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          Reset
        </button>
      </div>

      {previewOpen && out && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-dialog-heading"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3
                id="preview-dialog-heading"
                className="text-xl font-bold text-slate-900"
              >
                Full Image Preview & Comparison
              </h3>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview dialog"
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid max-h-[65vh] gap-6 overflow-y-auto p-1 sm:grid-cols-2">
              <div>
                <p className="sticky top-0 z-10 mb-2 bg-white/95 py-1 text-center text-sm font-bold text-slate-700 backdrop-blur-xs">
                  Original Image ({fmt(file.size)})
                </p>
                <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                  <Image
                    src={src}
                    alt={`Original full preview — ${file.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div>
                <p className="sticky top-0 z-10 mb-2 bg-white/95 py-1 text-center text-sm font-bold text-brand backdrop-blur-xs">
                  Output Image ({fmt(out.blob.size)})
                </p>
                <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                  <Image
                    src={out.url}
                    alt={`Processed output full preview — ${tool.name || "image"}`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close Preview
              </button>
              <Link
                href={out.url}
                download={`${base}-pixeltools.${EXT[type!]}`}
                rel="noopener"
                aria-label={`Download ${EXT[type!].toUpperCase()} image`}
                className="rounded-xl bg-brand px-6 py-2.5 font-semibold text-white shadow hover:bg-brand-dark"
              >
                Download Image
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}