"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  ["Home", "/"],
  ["Image Compressor", "/tools/image-compressor"],
  ["Image Resizer", "/tools/image-resizer"],
  ["JPG to PNG", "/tools/jpg-to-png"],
  ["PNG to JPG", "/tools/png-to-jpg"],
  ["WebP Converter", "/tools/jpg-to-webp"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Custom Purpose-Driven Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-inner group-hover:border-cyan-500/50 transition-all duration-300">
            {/* Backlight Glow */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-25 blur-md group-hover:opacity-75 transition duration-300"></div>

            {/* Image + Conversion Sync Icon */}
            <svg
              className="relative h-6 w-6 text-cyan-400 transition-transform duration-300 group-hover:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Circular Conversion Arrows */}
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

              {/* Inner Photo Frame Symbol */}
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
            <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400/80 mt-0.5">Image Converter</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map(([name, href]) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {name}
              </Link>
            );
          })}

          <Link
            href="/tools"
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-cyan-500/40 active:scale-95"
          >
            <span>All Tools</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
          aria-expanded={open}
          aria-controls="mnav"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mnav" aria-label="Mobile" className="flex flex-col gap-1.5 border-t border-slate-800 bg-slate-950 p-4 lg:hidden">
          {NAV.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-cyan-400"
            >
              {name}
            </Link>
          ))}
          <Link
            href="/tools"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-cyan-500/20"
          >
            All Tools
          </Link>
        </nav>
      )}
    </header>
  );
}