import Link from "next/link";
import { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
    >
      <div>
        {/* Header: Icon & Badge */}
        <div className="flex items-center justify-between">
          <span
            aria-hidden
            className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-2xl text-brand transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white group-hover:shadow-md group-hover:shadow-brand/20"
          >
            {tool.icon}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition-colors group-hover:bg-brand-soft group-hover:text-brand">
            Free
          </span>
        </div>

        {/* Content */}
        <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-brand">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {tool.desc}
        </p>
      </div>

      {/* Footer / CTA Action */}
      <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-brand">
        <span>Use Tool</span>
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </Link>
  );
}