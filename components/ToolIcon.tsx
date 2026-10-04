import React from "react";
import { Tool } from "@/lib/tools";
import { Minimize2, Scaling, ArrowRightLeft, FileCode, FileText } from "lucide-react";

const EXT_CONFIG: Record<string, { bg: string; shadow: string; label: string; type: "mountains" | "dots" | "webp" | "svg" | "pdf" | "word" | "generic" }> = {
  PNG: { bg: "#8B5CF6", shadow: "#7C3AED", label: "PNG", type: "dots" },
  JPG: { bg: "#EF4444", shadow: "#DC2626", label: "JPG", type: "mountains" },
  JPEG: { bg: "#EAB308", shadow: "#CA8A04", label: "JPEG", type: "mountains" },
  WEBP: { bg: "#10B981", shadow: "#059669", label: "WEBP", type: "webp" },
  SVG: { bg: "#F59E0B", shadow: "#D97706", label: "SVG", type: "svg" },
  PDF: { bg: "#E11D48", shadow: "#BE123C", label: "PDF", type: "pdf" },
  WORD: { bg: "#2563EB", shadow: "#1D4ED8", label: "WORD", type: "word" },
  TXT: { bg: "#A855F7", shadow: "#9333EA", label: "TEXT", type: "generic" },
};

function RenderInnerGraphic({ type }: { type: string }) {
  if (type === "dots") {
    return (
      <g fill="#FFFFFF">
        <rect x="18" y="16" width="3.5" height="3.5" rx="0.5" />
        <rect x="23" y="16" width="3.5" height="3.5" rx="0.5" />
        <rect x="15.5" y="19.5" width="3.5" height="3.5" rx="0.5" />
        <rect x="20.5" y="19.5" width="3.5" height="3.5" rx="0.5" />
        <rect x="25.5" y="19.5" width="3.5" height="3.5" rx="0.5" />
        <rect x="18" y="23" width="3.5" height="3.5" rx="0.5" />
        <rect x="23" y="23" width="3.5" height="3.5" rx="0.5" />
      </g>
    );
  }
  if (type === "mountains") {
    return (
      <path
        d="M15 26 L20 18 L24 23 L27 19 L32 26 Z"
        fill="#FFFFFF"
      />
    );
  }
  if (type === "webp") {
    return (
      <g>
        <path d="M16 18 H30 V26 H16 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" rx="1.5" />
        <path d="M18 24 L22 19 L25 22 L27 20 L29 24 Z" fill="#FFFFFF" />
      </g>
    );
  }
  if (type === "svg") {
    return (
      <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
        <line x1="22" y1="16" x2="22" y2="26" />
        <line x1="17" y1="21" x2="27" y2="21" />
        <circle cx="22" cy="21" r="2" fill="#FFFFFF" />
      </g>
    );
  }
  return (
    <rect x="17" y="18" width="12" height="8" rx="1" fill="#FFFFFF" opacity="0.9" />
  );
}

function SingleDocFile({
  ext,
  x,
  y,
  scale = 1,
  opacity = 1,
}: {
  ext: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  const config = EXT_CONFIG[ext.toUpperCase()] || {
    bg: "#64748B",
    shadow: "#475569",
    label: ext.toUpperCase(),
    type: "generic",
  };

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <path
        d="M 6 0 L 28 0 C 31.5 0 34 2.5 34 6 L 34 38 C 34 41.5 31.5 44 28 44 L 6 44 C 2.5 44 0 41.5 0 38 L 0 6 C 0 2.5 2.5 0 6 0 Z"
        fill={config.bg}
      />
      <path
        d="M 22 0 L 34 12 L 26 12 C 23.8 12 22 10.2 22 8 Z"
        fill={config.shadow}
        opacity="0.65"
      />
      <RenderInnerGraphic type={config.type} />
      <text
        x="17"
        y="37"
        fill="#FFFFFF"
        fontSize="8.5"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="0.3"
      >
        {config.label}
      </text>
    </g>
  );
}

export default function ToolIcon({ tool }: { tool: Tool }) {
  if (tool.category === "Convert" && tool.from && tool.to) {
    const getCleanExt = (mime?: string) => {
      if (!mime) return "FILE";
      if (mime.includes("jpeg") || mime.includes("jpg")) return "JPG";
      if (mime.includes("png")) return "PNG";
      if (mime.includes("webp")) return "WEBP";
      if (mime.includes("svg")) return "SVG";
      if (mime.includes("pdf")) return "PDF";
      if (mime.includes("word")) return "WORD";
      return mime.split("/")[1]?.toUpperCase() || "FILE";
    };

    const fromExt = getCleanExt(tool.from);
    const toExt = getCleanExt(tool.to);

    return (
      <div className="relative h-14 w-16 select-none">
        <svg viewBox="0 0 68 58" className="h-full w-full overflow-visible">
          <SingleDocFile ext={fromExt} x={4} y={0} scale={0.95} opacity={0.88} />
          <SingleDocFile ext={toExt} x={26} y={10} scale={1.05} opacity={1} />
          <path
            d="M 8 46 C 4 53, 12 56, 18 53 L 23 48"
            fill="none"
            stroke={EXT_CONFIG[toExt.toUpperCase()]?.bg || "#3B82F6"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 17 46 L 24 48 L 22 55"
            fill="none"
            stroke={EXT_CONFIG[toExt.toUpperCase()]?.bg || "#3B82F6"}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (tool.slug === "image-compressor") {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <Minimize2 className="h-6 w-6" />
      </div>
    );
  }

  if (tool.slug === "image-resizer") {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <Scaling className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-700">
      <ArrowRightLeft className="h-6 w-6" />
    </div>
  );
}