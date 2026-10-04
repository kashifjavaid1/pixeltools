import Link from "next/link";

const TOOLS_LINKS = [
  { name: "Image Compressor", href: "/tools/image-compressor" },
  { name: "Image Resizer", href: "/tools/image-resizer" },
  { name: "JPG to PNG", href: "/tools/jpg-to-png" },
  { name: "PNG to JPG", href: "/tools/png-to-jpg" },
  { name: "WebP Converter", href: "/tools/jpg-to-webp" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950 text-slate-400 overflow-hidden mt-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-full max-w-7xl -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner group-hover:border-cyan-500/50 transition-all duration-300">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-25 blur-md group-hover:opacity-75 transition duration-300" />
                <svg
                  className="relative h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <polyline
                    points="18 3 18 7 14 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="6 21 6 17 10 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="8.5"
                    y="8.5"
                    width="7"
                    height="7"
                    rx="1.5"
                    className="fill-cyan-500/20 stroke-cyan-400"
                    strokeWidth="1.2"
                  />
                  <circle cx="10.5" cy="10.5" r="0.75" className="fill-cyan-300" />
                  <path
                    d="M15.5 13.5l-2-2-3 3"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Pixel<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Tools</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/80 mt-0.5">
                  IMAGE CONVERTER
                </span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Free, fast, and private online image utilities. Every tool runs locally inside your browser with zero server uploads and maximum privacy.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Popular Tools</h3>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="transition-colors duration-200 hover:text-cyan-400">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h3>
            <ul className="mt-4 space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="transition-colors duration-200 hover:text-cyan-400">Home</Link>
              </li>
              <li>
                <Link href="/tools" className="transition-colors duration-200 hover:text-cyan-400">All Tools</Link>
              </li>
              <li>
                <Link href="/#privacy" className="transition-colors duration-200 hover:text-cyan-400">Privacy Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} PixelTools. All rights reserved.</p>

          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            100% Client-Side & Private
          </div>
        </div>
      </div>
    </footer>
  );
}