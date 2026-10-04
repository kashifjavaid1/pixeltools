import Link from "next/link";
import ToolWorkspace from "@/components/ToolWorkspace";
import ToolCard from "@/components/ToolCard";
import { TOOLS, bySlug } from "@/lib/tools";
const STEPS = [["↑", "Upload", "Pick an image from your device."], ["⚙", "Process", "Your browser does the work locally."], ["↓", "Download", "Save the result in one click."]];
export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 pb-8 pt-14 text-center sm:pt-20">
        <h1 className="rise text-4xl font-extrabold tracking-tight sm:text-6xl">Free Image Tools. Fast, Private, and Simple.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">Compress, resize and convert your images directly in your browser. No uploads. No registration.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/tools/image-compressor" className="rounded-xl bg-brand px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-95">Compress an Image</Link>
          <Link href="/tools" className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold transition hover:border-brand">Explore All Tools</Link>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4" aria-label="Compress an image now"><ToolWorkspace tool={bySlug("image-compressor")!} /></section>
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">Everything You Need to Work With Images</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{TOOLS.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>
     <section className="mx-auto mt-28 max-w-5xl px-4">
  <div className="text-center">
    <span className="text-xs font-bold uppercase tracking-wider text-brand">
      Simple Process
    </span>
    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
      How It Works
    </h2>
    <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
      Get your images processed locally in three simple, privacy-focused steps.
    </p>
  </div>

  <ol className="mt-12 grid gap-6 sm:grid-cols-3">
    {STEPS?.map(([i, t, d], index) => (
      <li
        key={t}
        className="group relative flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
      >
        <span className="absolute right-4 top-4 text-xs font-extrabold text-slate-300 transition-colors group-hover:text-brand/60">
          0{index + 1}
        </span>
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-xl text-brand transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white group-hover:shadow-md group-hover:shadow-brand/20"
        >
          {i}
        </span>
        <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-brand">
          {t}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {d}
        </p>
      </li>
    ))}
  </ol>
</section>
      <section id="privacy" className="mx-auto mt-24 max-w-4xl scroll-mt-24 rounded-3xl bg-ink px-6 py-12 text-white sm:px-12">
        <h2 className="text-3xl font-extrabold tracking-tight">Your files stay on your device.</h2>
        <p className="mt-4 max-w-2xl text-slate-300">Every tool runs inside your browser using built-in image features. Your images are never sent to a server, and there is no account or database. You can confirm this in your browser&apos;s network tab while using a tool.</p>
        <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">{["No registration required", "Browser-based processing", "Works on mobile", "Simple interface"].map((p) => <li key={p}>✓ {p}</li>)}</ul>
      </section>
    </>
  );
}
