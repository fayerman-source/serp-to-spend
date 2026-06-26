"use client";

import { useState } from "react";
import { C, serif, sans, MAXW, Eyebrow, SiteHeader, SiteFooter } from "./ui";
import type { Mode, Platform, Teardown, ApiResult } from "./types";
import { TeardownView, AdPackView, Spinner, RISK_COLOR } from "./components/results";
import { Credibility, HowItWorks } from "./components/sections";

// An ad shorter than this can't be meaningfully assessed (a single word gives
// the model no claim, product, or context to judge). Block it rather than
// return a confident verdict on nothing.
const MIN_AD_CHARS = 15;

// Static styles (no state dependency) live at module scope so they are not
// re-created on every render.
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
    if (loading) return; // don't switch modes mid-request; avoids a stale result landing in the other tab
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
      if (!data?.teardown) throw new Error("The server returned an unexpected response.");
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
      if (!Array.isArray(data?.pack?.angles)) throw new Error("The server returned an unexpected response.");
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

  return (
    <>
      <SiteHeader active="/" />

      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0" }}>
        <Eyebrow>Ad compliance, grounded in law</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontSize: "clamp(22px, 3.8vw, 38px)",
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
                aria-label="Ad platform"
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
              aria-label="Ad to check"
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
                aria-label="Keyword or competitor URL"
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
              Grounded in live Google Search
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

        {mode === "generate" && result && <AdPackView result={result} />}
      </main>

      <Credibility />
      <HowItWorks />
      <SiteFooter />
    </>
  );
}
