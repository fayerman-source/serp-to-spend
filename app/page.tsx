"use client";

import { useState } from "react";

type PolicyRisk = {
  level: "low" | "medium" | "high";
  policy_area: string;
  reasons: string[];
  safe_rewrite: { headline: string; primary_text: string };
};
type Ad = {
  platform: string;
  headline: string;
  primary_text: string;
  policy_risk: PolicyRisk;
};
type Section = { block: string; heading: string; body: string };
type LandingPage = {
  hero_headline: string;
  hero_subhead: string;
  primary_cta: string;
  form_fields: string[];
  sections: Section[];
};
type Angle = { name: string; rationale: string; ads: Ad[]; landing_page: LandingPage };
type Audience = { name: string; description: string; targeting_signals: string[] };
type AdPack = { angles: Angle[]; audiences: Audience[] };
type ApiResult = { source: string; query: string; pack: AdPack };

// Palette: white, teal accent, charcoal text, light-gray sections.
const C = {
  ink: "#1f2933",
  muted: "#5b6770",
  teal: "#0e9e8e",
  tealDark: "#0b7d71",
  bg: "#ffffff",
  soft: "#f4f7f8",
  line: "#e3e8ea",
};
const RISK_COLOR: Record<string, string> = {
  low: "#1f9d57",
  medium: "#b8770a",
  high: "#d92d2d",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: C.teal,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontSize: 12,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Wireframe({ lp }: { lp: LandingPage }) {
  return (
    <div
      style={{
        marginTop: 16,
        border: `1px dashed ${C.line}`,
        borderRadius: 10,
        padding: 16,
        background: C.soft,
      }}
    >
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, fontWeight: 600 }}>
        Landing-page wireframe (message-matched to this angle)
      </div>

      {/* Hero block */}
      <div
        style={{
          border: `1px solid ${C.line}`,
          borderRadius: 8,
          padding: "18px 14px",
          textAlign: "center",
          background: C.bg,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink }}>{lp.hero_headline}</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{lp.hero_subhead}</div>
        {lp.form_fields.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            {lp.form_fields.map((f, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  color: C.muted,
                  border: `1px solid ${C.line}`,
                  borderRadius: 6,
                  padding: "6px 10px",
                  background: C.soft,
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}
        <div
          style={{
            display: "inline-block",
            marginTop: 12,
            background: C.teal,
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            borderRadius: 999,
            padding: "8px 18px",
          }}
        >
          {lp.primary_cta}
        </div>
      </div>

      {/* Section stack */}
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        {lp.sections.map((s, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              padding: "10px 12px",
              background: C.bg,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: C.teal,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: "1px 6px",
                  fontWeight: 700,
                }}
              >
                {s.block}
              </span>
              <strong style={{ fontSize: 14, color: C.ink }}>{s.heading}</strong>
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cardStyle(): React.CSSProperties {
  return {
    border: `1px solid ${C.line}`,
    borderRadius: 12,
    padding: 24,
    marginTop: 18,
    background: C.bg,
    boxShadow: "0 1px 3px rgba(16,24,32,.04)",
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [grounded, setGrounded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, ground: grounded }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setResult(data as ApiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header bar */}
      <header style={{ borderBottom: `1px solid ${C.line}`, background: C.bg }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 20, color: C.ink, letterSpacing: "-0.01em" }}>
            SERP<span style={{ color: C.teal }}>→</span>Spend
          </div>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>
            Catch ad disapprovals before you submit
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px 96px" }}>
        <Eyebrow>Ad compliance + creative</Eyebrow>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "0 0 8px", color: C.ink, fontWeight: 800, letterSpacing: "-0.01em" }}>
          Catch the ads that get rejected, before you submit
        </h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 17, maxWidth: 700 }}>
          Paste a keyword or competitor URL. It writes platform-native ads for Meta, Google, and
          TikTok, then flags every claim that could get them rejected and tells you what to prove.
          Plus distinct angles, landing pages, and audiences.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="best CRM for real estate   or   https://competitor.com/offer"
            style={{
              flex: "1 1 320px",
              padding: "13px 15px",
              borderRadius: 8,
              border: `1px solid ${C.line}`,
              background: C.bg,
              color: C.ink,
              fontSize: 15,
            }}
          />
          <button
            onClick={run}
            disabled={loading || !input.trim()}
            style={{
              padding: "13px 26px",
              borderRadius: 8,
              border: "none",
              background: loading || !input.trim() ? "#9fc9c3" : C.teal,
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading || !input.trim() ? "default" : "pointer",
            }}
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            fontSize: 14,
            color: C.muted,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={grounded}
            onChange={(e) => setGrounded(e.target.checked)}
            style={{ accentColor: C.teal, width: 16, height: 16 }}
          />
          Ground in live Google Search (uncheck to compare ungrounded output)
        </label>

        {error && (
          <p style={{ color: RISK_COLOR.high, marginTop: 16, fontWeight: 600 }}>Error: {error}</p>
        )}

        {result && (
          <div style={{ marginTop: 28 }}>
            <p style={{ color: C.muted, fontSize: 13 }}>
              Grounding:{" "}
              <strong style={{ color: C.ink }}>
                {result.source === "url"
                  ? "competitor/offer page"
                  : result.source === "gemini-search"
                    ? "live Google Search (Gemini grounding)"
                    : result.source === "serpapi"
                      ? "live Google SERP (SerpApi)"
                      : "keyword only (no live search this run)"}
              </strong>{" "}
              · query: <em>{result.query}</em>
            </p>

            {result.pack.angles.map((angle, i) => (
              <section key={i} style={cardStyle()}>
                <Eyebrow>Angle {i + 1}</Eyebrow>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, color: C.ink, fontWeight: 800 }}>
                  {angle.name}
                </h2>
                <p style={{ color: C.muted, marginTop: 0, fontSize: 14 }}>{angle.rationale}</p>

                <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                  {angle.ads.map((ad, j) => (
                    <div
                      key={j}
                      style={{
                        border: `1px solid ${C.line}`,
                        borderRadius: 8,
                        padding: 14,
                        background: C.soft,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <strong
                          style={{
                            fontSize: 12,
                            color: C.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {ad.platform}
                        </strong>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: RISK_COLOR[ad.policy_risk.level] ?? C.muted,
                            border: `1px solid ${RISK_COLOR[ad.policy_risk.level] ?? C.line}`,
                            borderRadius: 999,
                            padding: "2px 10px",
                            background: "#fff",
                          }}
                          title={ad.policy_risk.reasons.join(" · ")}
                        >
                          {ad.policy_risk.level} risk
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 4, color: C.ink }}>
                        {ad.headline}
                      </div>
                      <div style={{ fontSize: 14, color: C.ink }}>{ad.primary_text}</div>

                      {ad.policy_risk.policy_area &&
                        ad.policy_risk.policy_area.toLowerCase() !== "none" && (
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
                            <strong style={{ color: RISK_COLOR[ad.policy_risk.level] ?? C.muted }}>
                              Policy at risk:
                            </strong>{" "}
                            {ad.policy_risk.policy_area}
                          </div>
                        )}

                      {ad.policy_risk.reasons.length > 0 && (
                        <ul
                          style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12, color: C.muted }}
                        >
                          {ad.policy_risk.reasons.map((r, k) => (
                            <li key={k}>{r}</li>
                          ))}
                        </ul>
                      )}

                      {ad.policy_risk.level !== "low" && (
                        <div
                          style={{
                            marginTop: 10,
                            border: `1px solid ${RISK_COLOR.low}`,
                            background: "#f0faf3",
                            borderRadius: 6,
                            padding: "10px 12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: RISK_COLOR.low,
                              marginBottom: 4,
                            }}
                          >
                            Rewrite that passes
                          </div>
                          <div style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>
                            {ad.policy_risk.safe_rewrite.headline}
                          </div>
                          <div style={{ fontSize: 14, color: C.ink }}>
                            {ad.policy_risk.safe_rewrite.primary_text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Wireframe lp={angle.landing_page} />
              </section>
            ))}

            <section style={cardStyle()}>
              <Eyebrow>Targeting</Eyebrow>
              <h2 style={{ margin: "0 0 12px", fontSize: 22, color: C.ink, fontWeight: 800 }}>
                Audience ideas
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {result.pack.audiences.map((aud, i) => (
                  <div key={i}>
                    <strong style={{ color: C.ink }}>{aud.name}</strong>
                    <div style={{ fontSize: 14, color: C.ink }}>{aud.description}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                      {aud.targeting_signals.join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
