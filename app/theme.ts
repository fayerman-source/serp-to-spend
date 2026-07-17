// Shared editorial design tokens (colors, fonts, layout width). Kept in their
// own dependency-free module so both server components (ui.tsx) and client
// components (components/auth-control.tsx) can import them from a single source
// of truth without creating a circular import.
export const C = {
  paper: "#f6f3ec",
  card: "#fbf9f4",
  soft: "#f1ece3",
  ink: "#1b1714",
  body: "#3a342c",
  muted: "#736a5c",
  faint: "#a79d8c",
  rule: "#e4ddcf",
  green: "#16463a",
  greenSoft: "#e9f1ea",
};
export const serif = "var(--font-fraunces), Georgia, 'Times New Roman', serif";
export const sans = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
export const MAXW = 940;
