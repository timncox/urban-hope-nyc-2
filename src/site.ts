import data from "./data/main.json";

export interface Page {
  slug: string;
  title: string;
  content: string;
}

export interface SiteConfig {
  site: {
    name: string;
    tagline: string;
    description: string;
    url?: string;
  };
  pages: Page[];
  theme: {
    accent: string;
    mode: "light" | "dark" | "auto";
    font: "sans" | "serif" | "mono";
  };
  design?: {
    aesthetic: string;
    fonts: {
      display: { family: string; import: string };
      body: { family: string; import: string };
    };
    palette: {
      light: { bg: string; fg: string; accent: string; muted: string; border: string };
      dark?: { bg: string; fg: string; accent: string; muted: string; border: string };
    };
    css: string;
  };
  schema?: {
    type: string;
    extra?: Record<string, unknown>;
  };
}

export const site: SiteConfig = data as SiteConfig;

export function getPage(slug: string): Page | undefined {
  const norm = slug.startsWith("/") ? slug : `/${slug}`;
  return site.pages.find((p) => p.slug === norm);
}

export function getNonHomePages(): Page[] {
  return site.pages.filter((p) => p.slug !== "/");
}

export function pathFromSlug(slug: string): string {
  return slug === "/" ? "" : slug.replace(/^\//, "");
}
