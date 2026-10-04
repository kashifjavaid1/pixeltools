import Link from "next/link";
import { Tool } from "@/lib/tools";
import ToolIcon from "./ToolIcon";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-transform duration-300 group-hover:scale-105 group-hover:bg-blue-50/80 dark:bg-slate-800/60 dark:group-hover:bg-slate-800">
            <ToolIcon tool={tool} />
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400">
            Free
          </span>
        </div>

        <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {tool.desc}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
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