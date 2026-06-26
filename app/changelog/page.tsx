import type { Metadata } from "next";
import type { ReactNode } from "react";
import { C, serif, sans, MAXW, Eyebrow, SiteHeader, SiteFooter } from "../ui";

export const metadata: Metadata = {
  title: "Changelog · SERP-to-Spend",
  description: "Built in the open, one pull request at a time.",
};

const LOG: Array<{ date: string; items: Array<{ k: string; n: ReactNode }> }> = [
  {
    date: "June 24, 2026",
    items: [
      {
        k: "scan",
        n: (
          <>
            Selected the problem with{" "}
            <a
              href="https://1mil.app/github"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: C.green, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              1mil.app
            </a>, my own opportunity-scanner, which surfaced the unserved gap between ad creation and ad
            compliance.
          </>
        ),
      },
      { k: "first-build", n: "First build: ad compliance and creative for paid search and social." },
      { k: "teardown", n: "Check-an-ad compliance teardown, with versioned prompts and validated output schemas." },
      { k: "ci", n: "Continuous integration (typecheck and build) on every pull request; unit tests wired in." },
      { k: "ftc-grounding", n: "Grounded the compliance check in FTC standards to stop over-flagging puffery on clean ads." },
    ],
  },
  {
    date: "June 25, 2026",
    items: [
      { k: "modules", n: "Rebuilt the compliance knowledge as sourced, cited modules (FTC, Meta, Google, TikTok), each rule tied to a real authority." },
      { k: "fda-bizopp", n: "Added FDA drug-claim and FTC Business Opportunity Rule coverage." },
      { k: "generate-grounding", n: "Grounded the Generate flow in the same modules, so both flows cite the same policies." },
      { k: "rewrites", n: "Hook-preserving rewrites: keep the persuasion, soften only the flagged claim, never substitute one claim for another." },
      { k: "copy-validation", n: "Copy affordances on every payload, input validation, and a softer background." },
      { k: "deploy-trim", n: "Provider-agnostic credentials for serverless deploy; trimmed Generate to fit the 60-second function limit." },
    ],
  },
  {
    date: "June 26, 2026",
    items: [
      { k: "visual-polish", n: "Visual polish: an editorial redesign (serif typography, the citation moat surfaced as a feature), a favicon, and a multi-page site (About and Changelog)." },
      { k: "readme", n: "Tightened the README copy and positioning." },
    ],
  },
];

export default function Changelog() {
  return (
    <>
      <SiteHeader active="/changelog" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Changelog</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: "clamp(22px, 3.8vw, 38px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: "12px 0 0",
          }}
        >
          Built in the open, one pull request at a time
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: C.body,
            margin: "16px 0 0",
            maxWidth: 640,
          }}
        >
          Every change shipped through a branch, continuous integration, tests, and review before it
          merged. This is the trail.
        </p>

        <div style={{ marginTop: 24 }}>
          {LOG.map((g) => (
            <section
              key={g.date}
              style={{
                display: "grid",
                gridTemplateColumns: "170px 1fr",
                gap: 28,
                padding: "30px 0",
                borderTop: `1px solid ${C.rule}`,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: C.green }}>{g.date}</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {g.items.map((it) => (
                  <li
                    key={it.k}
                    style={{ fontSize: 15.5, lineHeight: 1.55, color: C.body, paddingLeft: 18, position: "relative" }}
                  >
                    <span style={{ position: "absolute", left: 0, color: C.faint }}>&rsaquo;</span>
                    {it.n}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
