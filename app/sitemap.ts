import type { MetadataRoute } from "next";

const BASE = "https://serptospend.com";

// Real per-page last-modified dates, hardcoded on purpose. Using new Date()
// here would stamp every page with the build time and falsely signal a change
// on each deploy. Bump a page's date when its content actually changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, lastModified: "2026-06-26", changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: "2026-06-27", changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/changelog`, lastModified: "2026-06-27", changeFrequency: "weekly", priority: 0.7 },
  ];
}
