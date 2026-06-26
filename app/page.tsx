"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "./ui";

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
type Angle = { name: string; rationale: string; ads: Ad[] };
type Audience = { name: string; description: string; targeting_signals: string[] };
type AdPack = { angles: Angle[]; audiences: Audience[] };
type ApiResult = { source: string; query: string; pack: AdPack };

type Teardown = {
  platform: "Meta" | "Google" | "TikTok";
  level: "low" | "medium" | "high";
  policy_area: string;
  findings: Array<{ phrase: string; problem: string }>;
  ftc: { risk: "low" | "medium" | "high"; standard: string; why: string };
  safe_rewrite: { headline: string; primary_text: string };
};

type Mode = "check" | "generate";
type Platform = "Meta" | "Google" | "TikTok";

// Editorial / authority palette: warm paper, ink, a single deep-green accent.
const C = {
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
const RISK_COLOR: Record<string, string> = {
  low: "#2f6a52",
  medium: "#8a6314",
  high: "#9c3a2e",
};
const VERDICT: Record<string, string> = {
  low: "Looks clear",
  medium: "Ships only if substantiated",
  high: "Likely rejected as written",
};
// An ad shorter than this can't be meaningfully assessed (a single word gives
// the model no claim, product, or context to judge). Block it rather than
// return a confident verdict on nothing.
const MIN_AD_CHARS = 15;

const serif = "'Fraunces', Georgia, 'Times New Roman', serif";
const sans = "'Inter', ui-sans-serif, system-ui, sans-serif";
const MAXW = 940;

// The cited-authority moat, rendered as a reference list.
const CITES = [
  { c: "15 U.S.C. § 45(a)", l: "FTC Act: unfair or deceptive acts" },
  { c: "16 C.F.R. § 255.2(b)", l: "Endorsement Guides: typical results" },
  { c: "FDCA 21 U.S.C. § 321(g)", l: "Disease claims make a product a drug" },
  { c: "16 C.F.R. Part 437", l: "Business Opportunity Rule: earnings claims" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
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

function cardStyle(): React.CSSProperties {
  return {
    border: `1px solid ${C.rule}`,
    borderRadius: 14,
    padding: 24,
    marginTop: 18,
    background: C.card,
    boxShadow: "0 1px 0 rgba(0,0,0,.02), 0 24px 48px -38px rgba(27,23,20,.22)",
  };
}

// One-click copy. The buyer's next action is paste-into-ad-platform, so copy
// affordances sit on every discrete payload (a rewrite, an ad, an audience).
function CopyButton({
  text,
  label = "Copy",
  tone = "green",
}: Readonly<{
  text: string;
  label?: string;
  tone?: "green" | "rewrite";
}>) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const accent = tone === "rewrite" ? RISK_COLOR.low : C.green;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return; // clipboard unavailable, don't show a false success
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        fontFamily: sans,
        cursor: "pointer",
        fontSize: 12.5,
        fontWeight: 600,
        borderRadius: 6,
        padding: "5px 11px",
        border: `1px solid ${copied ? RISK_COLOR.low : C.rule}`,
        background: copied ? C.greenSoft : "transparent",
        color: copied ? RISK_COLOR.low : accent,
        whiteSpace: "nowrap",
        transition: "all .12s",
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

// Formats a teardown as a ready-to-paste prompt for the buyer's own LLM/agent.
function teardownPrompt(t: Teardown): string {
  const findings = t.findings.map((f) => `- "${f.phrase}": ${f.problem}`).join("\n");
  return `Rewrite this ad so it passes ${t.platform} review and FTC substantiation, keeping the original intent and offer.

Platform: ${t.platform}
Verdict: ${t.level}
Policy at risk: ${t.policy_area}
What trips it:
${findings || "- (nothing flagged)"}
FTC: ${t.ftc.standard}${t.ftc.why ? `: ${t.ftc.why}` : ""}

A passing rewrite to build on:
${t.safe_rewrite.headline}
${t.safe_rewrite.primary_text}

Give me 3 more compliant variations that keep the same angle.`;
}

function RewriteBox({ headline, primary_text }: { headline: string; primary_text: string }) {
  return (
    <div
      style={{
        marginTop: 14,
        border: `1px solid ${RISK_COLOR.low}`,
        background: C.greenSoft,
        borderRadius: 10,
        padding: "14px 16px",
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
        <span
          style={{
            fontFamily: sans,
            fontSize: 11.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: RISK_COLOR.low,
          }}
        >
          A version that passes
        </span>
        <CopyButton text={`${headline}\n\n${primary_text}`} label="Copy rewrite" tone="rewrite" />
      </div>
      <div style={{ fontFamily: serif, fontWeight: 600, color: C.ink, fontSize: 17 }}>{headline}</div>
      <div style={{ fontSize: 14.5, color: C.body, marginTop: 4, lineHeight: 1.5 }}>{primary_text}</div>
    </div>
  );
}

function TeardownView({ t }: { t: Teardown }) {
  const color = RISK_COLOR[t.level] ?? C.muted;
  return (
    <section style={cardStyle()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Eyebrow>{t.platform} review</Eyebrow>
        <span style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, color }}>
          {VERDICT[t.level] ?? t.level}
        </span>
      </div>

      {t.policy_area && t.policy_area.toLowerCase() !== "none" && (
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>
          <strong style={{ color }}>Policy at risk:</strong> {t.policy_area}
        </div>
      )}

      {t.findings.length > 0 && (
        <>
          <hr style={{ border: 0, borderTop: `1px solid ${C.rule}`, margin: "18px 0" }} />
          <div style={{ display: "grid", gap: 12 }}>
            {t.findings.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 12,
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: 15,
                    fontWeight: 600,
                    color: C.ink,
                    whiteSpace: "nowrap",
                  }}
                >
                  &ldquo;{f.phrase}&rdquo;
                </span>
                <span style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{f.problem}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {t.ftc && t.ftc.standard && t.ftc.standard.toLowerCase() !== "none" && (
        <div
          style={{
            marginTop: 18,
            borderLeft: `2px solid ${RISK_COLOR[t.ftc.risk] ?? C.muted}`,
            background: "#faf4e6",
            padding: "12px 16px",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <div
            style={{
              fontFamily: sans,
              fontSize: 11.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: RISK_COLOR[t.ftc.risk] ?? C.muted,
            }}
          >
            Regulatory exposure: {t.ftc.risk}
          </div>
          <div style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, color: C.ink, marginTop: 5 }}>
            {t.ftc.standard}
          </div>
          {t.ftc.why && (
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{t.ftc.why}</div>
          )}
        </div>
      )}

      {t.level === "low" ? (
        <div
          style={{
            marginTop: 14,
            border: `1px solid ${RISK_COLOR.low}`,
            background: C.greenSoft,
            borderRadius: 10,
            padding: "14px 16px",
            fontSize: 14.5,
            fontWeight: 600,
            color: C.ink,
          }}
        >
          No changes needed. This ad looks clear.
        </div>
      ) : (
        <>
          <RewriteBox headline={t.safe_rewrite.headline} primary_text={t.safe_rewrite.primary_text} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <CopyButton text={teardownPrompt(t)} label="Copy as prompt" />
          </div>
        </>
      )}

      <div style={{ fontSize: 11.5, color: C.faint, marginTop: 14, fontStyle: "italic" }}>
        Decision support for the advertiser, not legal advice.
      </div>
    </section>
  );
}

// Static marketing sections, always visible below the tool.
function Credibility() {
  return (
    <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "56px 28px 0" }}>
      <hr style={{ border: 0, borderTop: `1px solid ${C.rule}`, margin: 0 }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 48,
          marginTop: 44,
        }}
      >
        <div>
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
        <div style={{ alignSelf: "start" }}>
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

function HowItWorks() {
  const steps: Array<[string, string, string]> = [
    ["01", "Paste your ad", "Drop in the headline and body, pick the platform you are running on."],
    ["02", "Get the verdict", "The exact policy it would trip, the regulatory risk, and the phrases that cause it."],
    ["03", "Ship the rewrite", "A version that keeps the hook and passes review, ready to paste into Ads Manager."],
  ];
  return (
    <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "56px 28px 0" }}>
      <hr style={{ border: 0, borderTop: `1px solid ${C.rule}`, margin: 0 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 36, marginTop: 44 }}>
        {steps.map(([n, h, b]) => (
          <div key={n}>
            <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, color: C.green }}>{n}</div>
            <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.ink, marginTop: 8 }}>{h}</div>
            <div style={{ fontSize: 14.5, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 13,
        height: 13,
        flex: "none",
        border: `2px solid ${C.rule}`,
        borderTopColor: C.green,
        borderRadius: "50%",
        animation: "sps 0.7s linear infinite",
      }}
    />
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("check");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // check-an-ad mode
  const [platform, setPlatform] = useState<Platform>("Meta");
  const [adText, setAdText] = useState("");
  const [teardown, setTeardown] = useState<Teardown | null>(null);

  // generate mode
  const [input, setInput] = useState("");
  const [grounded, setGrounded] = useState(true);
  const [result, setResult] = useState<ApiResult | null>(null);

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
  }

  async function runCheck() {
    if (adText.trim().length < MIN_AD_CHARS || loading) return;
    setLoading(true);
    setError(null);
    setTeardown(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform, ad: adText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setTeardown(data.teardown as Teardown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function runGenerate() {
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

  const tab = (m: Mode): React.CSSProperties => ({
    fontFamily: sans,
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${mode === m ? C.green : C.rule}`,
    background: mode === m ? C.green : "transparent",
    color: mode === m ? C.paper : C.ink,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  });

  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 8,
    border: `1px solid ${C.rule}`,
    background: C.card,
    color: C.ink,
    fontSize: 15,
    fontFamily: sans,
  };

  const primaryBtn = (disabled: boolean): React.CSSProperties => ({
    fontFamily: sans,
    padding: "12px 26px",
    borderRadius: 8,
    border: "none",
    background: disabled ? "#a7bdb4" : C.green,
    color: C.paper,
    fontWeight: 600,
    fontSize: 15,
    cursor: disabled ? "default" : "pointer",
  });

  return (
    <>
      <style>{`@keyframes sps{to{transform:rotate(360deg)}}`}</style>
      <SiteHeader active="/" />

      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0" }}>
        <Eyebrow>Ad compliance, grounded in law</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontSize: "clamp(18px, 3.8vw, 38px)",
            whiteSpace: "nowrap",
            lineHeight: 1.06,
            margin: "12px 0 0",
            color: C.ink,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Write ads that survive Meta, Google, and FTC review
        </h1>
        <p style={{ color: C.body, margin: "14px 0 0", fontSize: 17.5, lineHeight: 1.5 }}>
          {mode === "check"
            ? "Paste an ad you are about to run. Get the exact Meta, Google, or TikTok policy it would trip, the regulatory risk (FTC, and FDA for disease claims), and a version that passes."
            : "Paste a keyword or competitor URL. It writes platform-native ads for Meta, Google, and TikTok, each with the same per-platform policy check, plus distinct angles and audience ideas."}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <button onClick={() => switchMode("check")} style={tab("check")}>
            Check an ad
          </button>
          <button onClick={() => switchMode("generate")} style={tab("generate")}>
            Generate ads
          </button>
        </div>

        {mode === "check" ? (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                style={{ ...inputStyle, fontWeight: 600 }}
              >
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
              <button
                onClick={runCheck}
                disabled={loading || adText.trim().length < MIN_AD_CHARS}
                style={primaryBtn(loading || adText.trim().length < MIN_AD_CHARS)}
              >
                {loading ? "Checking…" : "Check ad"}
              </button>
            </div>
            <textarea
              value={adText}
              onChange={(e) => {
                setAdText(e.target.value);
                if (!e.target.value.trim()) {
                  setTeardown(null); // don't leave a stale verdict on a cleared input
                  setError(null);
                }
              }}
              rows={4}
              placeholder="Paste the ad you are about to run (headline and body)…"
              style={{
                ...inputStyle,
                width: "100%",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            {adText.trim().length > 0 && adText.trim().length < MIN_AD_CHARS && (
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
                Paste a full ad (a headline, ideally a body line) so we can judge platform risk. One or two words is too
                little to assess.
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (!e.target.value.trim()) {
                    setResult(null); // clear stale results on a cleared input
                    setError(null);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && runGenerate()}
                placeholder="best CRM for real estate   or   https://competitor.com/offer"
                style={{ ...inputStyle, flex: "1 1 320px" }}
              />
              <button
                onClick={runGenerate}
                disabled={loading || !input.trim()}
                style={primaryBtn(loading || !input.trim())}
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
                style={{ accentColor: C.green, width: 16, height: 16 }}
              />
              Ground in live Google Search (uncheck to compare ungrounded output)
            </label>
          </div>
        )}

        {error && (
          <p style={{ color: RISK_COLOR.high, marginTop: 16, fontWeight: 600 }}>Error: {error}</p>
        )}

        {loading && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              color: C.muted,
              lineHeight: 1.5,
            }}
          >
            <Spinner />
            <span>
              {mode === "generate"
                ? "Working. This usually takes up to a minute: it grounds your input in live Google Search, then writes and policy-checks an ad for every platform."
                : "Checking your ad against the platform's published policy and the FTC standards."}
            </span>
          </div>
        )}

        {mode === "check" && teardown && <TeardownView t={teardown} />}

        {mode === "generate" && result && (
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
                <h2 style={{ fontFamily: serif, margin: "10px 0 4px", fontSize: 23, color: C.ink, fontWeight: 600 }}>
                  {angle.name}
                </h2>
                <p style={{ color: C.muted, marginTop: 0, fontSize: 14, lineHeight: 1.5 }}>{angle.rationale}</p>

                <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                  {angle.ads.map((ad, j) => (
                    <div
                      key={j}
                      style={{
                        border: `1px solid ${C.rule}`,
                        borderRadius: 10,
                        padding: 16,
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
                            fontFamily: sans,
                            fontSize: 11.5,
                            color: C.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontWeight: 700,
                          }}
                        >
                          {ad.platform}
                        </strong>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CopyButton text={`${ad.headline}\n\n${ad.primary_text}`} label="Copy ad" />
                          <span
                            style={{
                              fontFamily: sans,
                              fontSize: 12,
                              fontWeight: 600,
                              color: RISK_COLOR[ad.policy_risk.level] ?? C.muted,
                              border: `1px solid ${RISK_COLOR[ad.policy_risk.level] ?? C.rule}`,
                              borderRadius: 999,
                              padding: "2px 10px",
                              background: C.card,
                            }}
                            title={ad.policy_risk.reasons.join(" · ")}
                          >
                            {ad.policy_risk.level} risk
                          </span>
                        </div>
                      </div>
                      <div style={{ fontFamily: serif, fontWeight: 600, marginBottom: 4, color: C.ink, fontSize: 17 }}>
                        {ad.headline}
                      </div>
                      <div style={{ fontSize: 14.5, color: C.body, lineHeight: 1.5 }}>{ad.primary_text}</div>

                      {ad.policy_risk.policy_area &&
                        ad.policy_risk.policy_area.toLowerCase() !== "none" && (
                          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8 }}>
                            <strong style={{ color: RISK_COLOR[ad.policy_risk.level] ?? C.muted }}>
                              Policy at risk:
                            </strong>{" "}
                            {ad.policy_risk.policy_area}
                          </div>
                        )}

                      {ad.policy_risk.reasons.length > 0 && (
                        <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
                          {ad.policy_risk.reasons.map((r, k) => (
                            <li key={k}>{r}</li>
                          ))}
                        </ul>
                      )}

                      {ad.policy_risk.level !== "low" && (
                        <RewriteBox
                          headline={ad.policy_risk.safe_rewrite.headline}
                          primary_text={ad.policy_risk.safe_rewrite.primary_text}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <section style={cardStyle()}>
              <Eyebrow>Targeting</Eyebrow>
              <h2 style={{ fontFamily: serif, margin: "10px 0 12px", fontSize: 23, color: C.ink, fontWeight: 600 }}>
                Audience ideas
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {result.pack.audiences.map((aud) => (
                  <div
                    key={aud.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div>
                      <strong style={{ fontFamily: serif, color: C.ink, fontSize: 16 }}>{aud.name}</strong>
                      <div style={{ fontSize: 14, color: C.body, marginTop: 2 }}>{aud.description}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                        {aud.targeting_signals.join(" · ")}
                      </div>
                    </div>
                    <CopyButton
                      text={`${aud.name}\n${aud.description}\n${aud.targeting_signals.join(" · ")}`}
                      label="Copy targeting"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <Credibility />
      <HowItWorks />
      <SiteFooter />
    </>
  );
}
