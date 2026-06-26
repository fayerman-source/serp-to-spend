"use client";

import { useEffect, useRef, useState } from "react";
import { C, serif, sans, Eyebrow } from "../ui";
import type { Teardown, ApiResult } from "../types";

export const RISK_COLOR: Record<string, string> = {
  low: "#2f6a52",
  medium: "#8a6314",
  high: "#9c3a2e",
};
const VERDICT: Record<string, string> = {
  low: "Looks clear",
  medium: "Ships only if substantiated",
  high: "Likely rejected as written",
};

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

export function Spinner() {
  // Keyframe `sps` is defined once in app/globals.css.
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

function RewriteBox({ headline, primary_text }: Readonly<{ headline: string; primary_text: string }>) {
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

export function TeardownView({ t }: Readonly<{ t: Teardown }>) {
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

export function AdPackView({ result }: Readonly<{ result: ApiResult }>) {
  return (
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
  );
}
