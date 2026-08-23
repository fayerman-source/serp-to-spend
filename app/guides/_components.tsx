// Shared prose components for the guides section, mirroring the editorial
// style already used on /about (H2/P/Section/H3), so guide pages read as part
// of the same site rather than a bolted-on blog.
import type { ReactNode } from "react";
import Link from "next/link";
import { C, serif, sans } from "../ui";

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

export function Title({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h1
      style={{
        fontFamily: serif,
        fontWeight: 600,
        fontSize: "clamp(26px, 3.6vw, 38px)",
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color: C.ink,
        margin: "12px 0 0",
        maxWidth: 740,
      }}
    >
      {children}
    </h1>
  );
}

export function Dek({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p style={{ fontSize: 17.5, lineHeight: 1.55, color: C.body, margin: "16px 0 0", maxWidth: 680 }}>{children}</p>
  );
}

export function H2({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h2
      style={{
        fontFamily: serif,
        fontWeight: 600,
        fontSize: 26,
        lineHeight: 1.18,
        color: C.ink,
        letterSpacing: "-0.01em",
        margin: "0 0 14px",
      }}
    >
      {children}
    </h2>
  );
}

export function H3({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h3 style={{ fontFamily: serif, fontWeight: 600, fontSize: 18, lineHeight: 1.3, color: C.ink, margin: "0 0 8px" }}>
      {children}
    </h3>
  );
}

export function P({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p style={{ fontSize: 16.5, lineHeight: 1.62, color: C.body, margin: "0 0 16px", maxWidth: 680 }}>{children}</p>
  );
}

export function UL({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ul style={{ margin: "0 0 16px", padding: "0 0 0 20px", maxWidth: 680 }}>{children}</ul>
  );
}

export function LI({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <li style={{ fontSize: 16.5, lineHeight: 1.62, color: C.body, margin: "0 0 8px" }}>{children}</li>
  );
}

export function Section({ children }: Readonly<{ children: ReactNode }>) {
  return <section style={{ padding: "40px 0", borderTop: `1px solid ${C.rule}` }}>{children}</section>;
}

export function SourceNote({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: C.faint, margin: "0 0 16px", maxWidth: 680 }}>{children}</p>
  );
}

export function CTA({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      style={{
        background: C.greenSoft,
        border: `1px solid ${C.rule}`,
        borderRadius: 12,
        padding: "22px 26px",
        margin: "8px 0 0",
        maxWidth: 680,
      }}
    >
      <p style={{ fontSize: 15.5, lineHeight: 1.55, color: C.body, margin: "0 0 12px" }}>{children}</p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 14.5,
          color: C.paper,
          background: C.green,
          padding: "10px 18px",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Check an ad now &rarr;
      </Link>
    </div>
  );
}
