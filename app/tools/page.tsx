import type { Metadata } from "next";
import ToolsDirectory from "@/components/ToolsDirectory";
export const metadata: Metadata = { title: "All Image Tools | PixelTools", description: "Browse every PixelTools image tool: compress, resize and convert images in your browser." };
export default function Page() {
  return (<div className="mx-auto max-w-6xl px-4 py-12"><h1 className="mb-8 text-4xl font-extrabold tracking-tight">All Tools</h1><ToolsDirectory /></div>);
}
