import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#14213d", brand: { DEFAULT: "#2f5bea", dark: "#1f43bd", soft: "#eef2ff" } },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] } } }, plugins: [] } satisfies Config;
