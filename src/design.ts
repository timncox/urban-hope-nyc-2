// GENERATED from lib/llm/design.ts by scripts/bundle-template.mjs — do not edit here.
// Edit lib/llm/design.ts (it is the unit-tested source) and run `npm run bundle:template`.

/**
 * Build-time safety layer for the optional `design` block in main.json.
 * Pure, dependency-free. This is the backstop that guarantees an Astro build
 * cannot be broken by generated or hand-edited design data.
 */

export interface FontSpec {
  family: string;
  import: string | null; // validated stylesheet URL, or null → system fallback
}
export interface Palette {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  border: string;
}
export interface Design {
  aesthetic: string;
  fonts: { display: FontSpec; body: FontSpec };
  palette: { light: Palette; dark?: Palette };
  css: string;
}

const PALETTE_DEFAULTS: Palette = {
  bg: "#ffffff",
  fg: "#111111",
  accent: "#3B82F6",
  muted: "#666666",
  border: "#e5e5e5",
};

const FONT_HOSTS = new Set(["fonts.googleapis.com", "fonts.gstatic.com"]);
const COLOR_RE = /^[#a-zA-Z0-9 ,.%()/-]+$/; // no ; { } < > ' " : etc.

/** Remove the only character sequence that can escape a <style> context. */
export function sanitizeCss(css: string): string {
  return String(css).replace(/<\s*\/\s*style/gi, "<\\/style");
}

/** Allow only Google Fonts stylesheet URLs; everything else → null. */
export function safeFontImport(url: unknown): string | null {
  if (typeof url !== "string") return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  return FONT_HOSTS.has(u.hostname) ? url : null;
}

/** Pass plausible CSS colors; reject anything that could break out of a var. */
export function safeColor(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t || t.length > 64) return null;
  if (/url\(/i.test(t)) return null;
  return COLOR_RE.test(t) ? t : null;
}

function isStr(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function fontSpec(raw: any): FontSpec | null {
  if (!raw || !isStr(raw.family)) return null;
  return { family: raw.family, import: safeFontImport(raw.import) };
}

function palette(raw: any): Palette | null {
  if (!raw || typeof raw !== "object") return null;
  const out: Palette = { ...PALETTE_DEFAULTS };
  for (const k of ["bg", "fg", "accent", "muted", "border"] as const) {
    out[k] = safeColor(raw[k]) ?? PALETTE_DEFAULTS[k];
  }
  return out;
}

/** Validate a raw design object. Returns null (→ legacy render) if structurally wrong. */
export function validateDesign(raw: unknown): Design | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as any;
  if (!isStr(r.aesthetic)) return null;
  if (!r.fonts || !r.palette) return null;
  const display = fontSpec(r.fonts.display);
  const body = fontSpec(r.fonts.body);
  if (!display || !body) return null;
  const light = palette(r.palette.light);
  if (!light) return null;
  const dark = r.palette.dark ? palette(r.palette.dark) ?? undefined : undefined;
  return {
    aesthetic: r.aesthetic,
    fonts: { display, body },
    palette: { light, ...(dark ? { dark } : {}) },
    css: sanitizeCss(isStr(r.css) ? r.css : ""),
  };
}
