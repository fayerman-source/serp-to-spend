// Shared editorial design tokens + page chrome (header / footer), used by the
// tool page and the About / Changelog pages so every route stays consistent.
import type { ReactNode } from "react";
import Link from "next/link";

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

export function Eyebrow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      style={{
        fontFamily: sans,
        color: C.green,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontSize: 12,
      }}
    >
      {children}
    </div>
  );
}

const NAV = [
  { href: "/", label: "The Tool" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteHeader({ active }: Readonly<{ active?: string }>) {
  return (
    <header style={{ borderBottom: `1px solid ${C.rule}`, background: C.paper }}>
      <div
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 19,
            color: C.ink,
            letterSpacing: "-0.01em",
          }}
        >
          SERP<span style={{ color: C.green }}>·</span>to<span style={{ color: C.green }}>·</span>Spend
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center", fontFamily: sans, fontSize: 14 }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                textDecoration: "none",
                color: active === n.href ? C.green : C.muted,
                fontWeight: active === n.href ? 600 : 500,
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <div style={{ borderTop: `1px solid ${C.rule}`, marginTop: 64, background: C.paper }}>
      <div
        style={{
          maxWidth: MAXW,
          margin: "0 auto",
          padding: "30px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.ink }}>
          SERP·to·Spend
        </Link>
        <div style={{ fontFamily: sans, fontSize: 13.5, color: C.muted }}>
          Check an ad and generate ads, free, no account required.{" "}
          <span style={{ color: C.green, fontWeight: 600 }}>
            Pro is coming: saved reviews and bulk checks.
          </span>
        </div>
      </div>
    </div>
  );
}
