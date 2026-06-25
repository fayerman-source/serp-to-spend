"use client";

import { useEffect, useRef, useState } from "react";

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
const VERDICT: Record<string, string> = {
  low: "Looks clear",
  medium: "Ships only if substantiated",
  high: "Likely rejected as written",
};
// An ad shorter than this can't be meaningfully assessed (a single word gives
// the model no claim, product, or context to judge). Block it rather than
// return a confident verdict on nothing.
const MIN_AD_CHARS = 15;

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

// One-click copy. The buyer's next action is paste-into-ad-platform, so copy
// affordances sit on every discrete payload (a rewrite, an ad, an audience).
function CopyButton({
  text,
  label = "Copy",
  tone = "teal",
}: Readonly<{
  text: string;
  label?: string;
  tone?: "teal" | "rewrite";
}>) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const accent = tone === "rewrite" ? RISK_COLOR.low : C.teal;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          return; // clipboard unavailable — don't show a false success
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      }}
      style={{
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        borderRadius: 7,
        padding: "4px 9px",
        border: `1px solid ${copied ? RISK_COLOR.low : C.line}`,
        background: copied ? "#f0faf3" : C.bg,
        color: copied ? RISK_COLOR.low : accent,
        whiteSpace: "nowrap",
        transition: "all .12s",
      }}
    >
      {copied ? "Copied ✓" : `⧉ ${label}`}
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
FTC: ${t.ftc.standard}${t.ftc.why ? ` - ${t.ftc.why}` : ""}

A passing rewrite to build on:
${t.safe_rewrite.headline}
${t.safe_rewrite.primary_text}

Give me 3 more compliant variations that keep the same angle.`;
}

function RewriteBox({ headline, primary_text }: { headline: string; primary_text: string }) {
  return (
    <div
      style={{
        marginTop: 12,
        border: `1px solid ${RISK_COLOR.low}`,
        background: "#f0faf3",
        borderRadius: 8,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: RISK_COLOR.low,
          }}
        >
          Rewrite that passes
        </span>
        <CopyButton text={`${headline}\n\n${primary_text}`} label="Copy rewrite" tone="rewrite" />
      </div>
      <div style={{ fontWeight: 700, color: C.ink, fontSize: 14 }}>{headline}</div>
      <div style={{ fontSize: 14, color: C.ink }}>{primary_text}</div>
    </div>
  );
}

function TeardownView({ t }: { t: Teardown }) {
  const color = RISK_COLOR[t.level] ?? C.muted;
  return (
    <section style={cardStyle()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow>{t.platform} review</Eyebrow>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color,
            border: `1px solid ${color}`,
            borderRadius: 999,
            padding: "3px 12px",
          }}
        >
          {VERDICT[t.level] ?? t.level}
        </span>
      </div>

      {t.policy_area && t.policy_area.toLowerCase() !== "none" && (
        <div style={{ fontSize: 14, color: C.ink, marginTop: 4 }}>
          <strong style={{ color }}>Policy at risk:</strong> {t.policy_area}
        </div>
      )}

      {t.findings.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>
            What trips it
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {t.findings.map((f, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: C.soft,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>&ldquo;{f.phrase}&rdquo;</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{f.problem}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {t.ftc && t.ftc.standard && t.ftc.standard.toLowerCase() !== "none" && (
        <div
          style={{
            marginTop: 14,
            border: `1px solid ${RISK_COLOR[t.ftc.risk] ?? C.line}`,
            background: "#fff8ed",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: RISK_COLOR[t.ftc.risk] ?? C.muted,
              marginBottom: 4,
            }}
          >
            FTC substantiation risk: {t.ftc.risk}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t.ftc.standard}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{t.ftc.why}</div>
        </div>
      )}

      <RewriteBox headline={t.safe_rewrite.headline} primary_text={t.safe_rewrite.primary_text} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <CopyButton text={teardownPrompt(t)} label="Copy as prompt" />
      </div>

      <div style={{ fontSize: 11, color: C.muted, marginTop: 12, fontStyle: "italic" }}>
        Decision-support for the advertiser, not legal advice.
      </div>
    </section>
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

  const tab = (m: Mode, label: string): React.CSSProperties => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: `1px solid ${mode === m ? C.teal : C.line}`,
    background: mode === m ? C.teal : C.bg,
    color: mode === m ? "#fff" : C.ink,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  });

  return (
    <>
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
            Creative + compliance, one tool
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px 96px" }}>
        <Eyebrow>Ad compliance + creative</Eyebrow>
        <h1
          style={{
            fontSize: "clamp(28px,4vw,40px)",
            margin: "0 0 8px",
            color: C.ink,
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          Write ads that survive Meta, Google, and FTC review
        </h1>
        <p style={{ color: C.muted, marginTop: 0, fontSize: 17, maxWidth: 700 }}>
          {mode === "check"
            ? "Paste an ad you are about to run. Get the exact Meta, Google, or TikTok policy it would trip, the FTC substantiation risk, and a version that passes."
            : "Paste a keyword or competitor URL. It writes platform-native ads for Meta, Google, and TikTok, each with the same per-platform policy check, plus angles, landing pages, and audiences."}
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button onClick={() => switchMode("check")} style={tab("check", "Check an ad")}>
            Check an ad
          </button>
          <button onClick={() => switchMode("generate")} style={tab("generate", "Generate ads")}>
            Generate ads
          </button>
        </div>

        {mode === "check" ? (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                style={{
                  padding: "11px 12px",
                  borderRadius: 8,
                  border: `1px solid ${C.line}`,
                  background: C.bg,
                  color: C.ink,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                <option>Meta</option>
                <option>Google</option>
                <option>TikTok</option>
              </select>
              <button
                onClick={runCheck}
                disabled={loading || adText.trim().length < MIN_AD_CHARS}
                style={{
                  padding: "11px 26px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    loading || adText.trim().length < MIN_AD_CHARS ? "#9fc9c3" : C.teal,
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor:
                    loading || adText.trim().length < MIN_AD_CHARS ? "default" : "pointer",
                }}
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
                width: "100%",
                padding: "13px 15px",
                borderRadius: 8,
                border: `1px solid ${C.line}`,
                background: C.bg,
                color: C.ink,
                fontSize: 15,
                fontFamily: "inherit",
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
          <div style={{ marginTop: 20 }}>
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
                onClick={runGenerate}
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
          </div>
        )}

        {error && (
          <p style={{ color: RISK_COLOR.high, marginTop: 16, fontWeight: 600 }}>Error: {error}</p>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CopyButton
                            text={`${ad.headline}\n\n${ad.primary_text}`}
                            label="Copy ad"
                          />
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
                        <RewriteBox
                          headline={ad.policy_risk.safe_rewrite.headline}
                          primary_text={ad.policy_risk.safe_rewrite.primary_text}
                        />
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
                      <strong style={{ color: C.ink }}>{aud.name}</strong>
                      <div style={{ fontSize: 14, color: C.ink }}>{aud.description}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
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
    </>
  );
}
