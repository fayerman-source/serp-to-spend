import { C, serif, MAXW, Eyebrow } from "../ui";

// The cited-authority moat, rendered as a reference list.
const CITES = [
  { c: "15 U.S.C. § 45(a)", l: "FTC Act: unfair or deceptive acts" },
  { c: "16 C.F.R. § 255.2(b)", l: "Endorsement Guides: typical results" },
  { c: "FDCA 21 U.S.C. § 321(g)", l: "Disease claims make a product a drug" },
  { c: "16 C.F.R. Part 437", l: "Business Opportunity Rule: earnings claims" },
];

// Static marketing sections, always visible below the tool.
export function Credibility() {
  return (
    <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "56px 28px 0" }}>
      <hr style={{ border: 0, borderTop: `1px solid ${C.rule}`, margin: 0 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, marginTop: 44 }}>
        <div style={{ flex: "1 1 280px" }}>
          <Eyebrow>Why you can trust the verdict</Eyebrow>
          <h2
            style={{
              fontFamily: serif,
              fontWeight: 600,
              fontSize: 30,
              lineHeight: 1.15,
              color: C.ink,
              margin: "16px 0 0",
              letterSpacing: "-0.01em",
            }}
          >
            Every call traces to a real, named authority.
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: C.body, marginTop: 16, maxWidth: 380 }}>
            Not a prompt wrapper on a cold model. The platform policies and the FTC and FDA rules live
            in sourced, versioned modules. The tool names the exact statute, regulation, or published
            policy behind each flag, and knows the puffery line, so it does not cry wolf on a clean,
            already-running ad.
          </p>
        </div>
        <div style={{ flex: "1 1 280px", alignSelf: "start" }}>
          {CITES.map((x, i) => (
            <div
              key={x.c}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "16px 0",
                borderBottom: i < CITES.length - 1 ? `1px solid ${C.rule}` : "none",
              }}
            >
              <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 600, color: C.ink }}>{x.c}</span>
              <span style={{ fontSize: 13.5, color: C.muted, textAlign: "right", maxWidth: 230 }}>{x.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const steps: Array<[string, string, string]> = [
    ["01", "Paste your ad", "Drop in the headline and body, pick the platform you are running on."],
    ["02", "Get the verdict", "The exact policy it would trip, the regulatory risk, and the phrases that cause it."],
    ["03", "Ship the rewrite", "A version that keeps the hook and passes review, ready to paste into Ads Manager."],
  ];
  return (
    <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "56px 28px 0" }}>
      <hr style={{ border: 0, borderTop: `1px solid ${C.rule}`, margin: 0 }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 36, marginTop: 44 }}>
        {steps.map(([n, h, b]) => (
          <div key={n} style={{ flex: "1 1 200px" }}>
            <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, color: C.green }}>{n}</div>
            <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.ink, marginTop: 8 }}>{h}</div>
            <div style={{ fontSize: 14.5, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
