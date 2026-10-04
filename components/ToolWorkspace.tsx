"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ToolWorkspace({ tool }: { tool: Tool }) {
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

  // Drag and Drop Event Handlers
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
      <div className="w-full">
        {/* Upload & Drag Zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
          <p className="mt-1 text-sm text-slate-600">or click to browse from device</p>
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
      </div>
    );

  const red = out ? Math.round((1 - out.blob.size / file.size) * 100) : 0;
  const base = file.name.replace(/\.[^.]+$/, "");

  return (
    <div className="rise rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
      {/* Controls */}
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
                  onClick={() => setSize({ w, h })}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand hover:bg-brand-soft hover:text-brand active:scale-95"
                >
                  {n} <span className="ml-1 text-slate-400 font-normal">{w}×{h}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Original */}
        <figure className="group">
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-inner">
            <span className="absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
              Original
            </span>
            <img
              src={src}
              alt="Original upload preview"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{fmt(file.size)}</span>
            <span>{dim.w} × {dim.h} px</span>
          </figcaption>
        </figure>

        {/* Output Result */}
        <figure className="group">
          <div
            onClick={() => out && setPreviewOpen(true)}
            className={`relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100/70 p-2 shadow-inner transition-all duration-200 ${
              out ? "cursor-pointer hover:border-brand/60 hover:shadow-md" : ""
            }`}
          >
            <span className="absolute left-3 top-3 z-10 rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Output
            </span>

            {out && (
              <>
                <img
                  src={out.url}
                  alt="Processed result preview"
                  className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="rounded-xl bg-slate-900/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs">
                    🔍 Click for Full Preview
                  </span>
                </div>
              </>
            )}

            {busy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                <span className="mt-2 text-xs font-semibold text-slate-600">Processing...</span>
              </div>
            )}
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{out ? fmt(out.blob.size) : "Calculating..."}</span>
            <span>{tool.mode === "resize" ? `${size.w} × ${size.h} px` : `${dim.w} × ${dim.h} px`}</span>
          </figcaption>
        </figure>
      </div>

      {/* Reduction Alert Banner */}
      {out && !busy && (
        <div
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

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {out && type && (
          <a
            href={out.url}
            download={`${base}-pixeltools.${EXT[type]}`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark active:scale-95"
          >
            Download Image
          </a>
        )}
        {out && (
          <button
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-100 active:scale-95"
          >
            🔍 Preview Quality
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          Reset
        </button>
      </div>

      {/* Scrollable Lightbox / Full Preview Modal */}
      {previewOpen && out && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Full Image Preview & Comparison
              </h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Container for Long Images */}
            <div className="mt-6 grid max-h-[65vh] gap-6 overflow-y-auto p-1 sm:grid-cols-2">
              <div>
                <p className="sticky top-0 z-10 mb-2 bg-white/95 py-1 text-center text-sm font-bold text-slate-700 backdrop-blur-xs">
                  Original Image ({fmt(file.size)})
                </p>
                <div className="flex justify-center rounded-2xl bg-slate-100 p-2 border border-slate-200">
                  <img
                    src={src}
                    alt="Original full preview"
                    className="w-full h-auto max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>

              <div>
                <p className="sticky top-0 z-10 mb-2 bg-white/95 py-1 text-center text-sm font-bold text-brand backdrop-blur-xs">
                  Output Image ({fmt(out.blob.size)})
                </p>
                <div className="flex justify-center rounded-2xl bg-slate-100 p-2 border border-slate-200">
                  <img
                    src={out.url}
                    alt="Output full preview"
                    className="w-full h-auto max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close Preview
              </button>
              <a
                href={out.url}
                download={`${base}-pixeltools.${EXT[type!]}`}
                className="rounded-xl bg-brand px-6 py-2.5 font-semibold text-white shadow hover:bg-brand-dark"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}