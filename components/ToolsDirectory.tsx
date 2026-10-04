"use client";
import { useState } from "react";
import { TOOLS, Category } from "@/lib/tools";
import ToolCard from "./ToolCard";
const CATS: ("All" | Category)[] = ["All", "Compress", "Resize", "Convert"];
export default function ToolsDirectory() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState<"All" | Category>("All");
  const list = TOOLS.filter((t) => (cat === "All" || t.category === cat) && (t.name + t.desc).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <label htmlFor="s" className="sr-only">Search tools</label>
      <input id="s" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3" />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Categories">
        {CATS.map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c ? "bg-brand text-white" : "bg-white text-slate-700 ring-1 ring-slate-300 hover:ring-brand"}`}>{c}</button>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      {!list.length && <p className="mt-8 text-center text-slate-600">No tools match that search. Try a different word.</p>}
    </div>
  );
}
