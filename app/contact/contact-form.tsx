"use client";

import { useState } from "react";
import { C, sans } from "../theme";

const MAX_MESSAGE = 5000;

const field: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 8,
  border: `1px solid ${C.rule}`,
  background: C.card,
  color: C.ink,
  fontSize: 15,
  fontFamily: sans,
  width: "100%",
  boxSizing: "border-box",
};

const label: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 13,
  fontWeight: 600,
  color: C.muted,
  display: "block",
  margin: "0 0 6px",
};

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botcheck, setBotcheck] = useState(""); // honeypot: humans never fill this
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSend = email.trim() !== "" && message.trim() !== "" && status !== "sending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, botcheck }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <p style={{ fontFamily: sans, fontSize: 16, color: C.green, fontWeight: 600, margin: "24px 0 0" }}>
        Thanks. Your message is on its way. We&rsquo;ll get back to you at {email}.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 24, maxWidth: 560, display: "grid", gap: 16 }}>
      <div>
        <label htmlFor="c-name" style={label}>
          Name (optional)
        </label>
        <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} style={field} />
      </div>
      <div>
        <label htmlFor="c-email" style={label}>
          Email
        </label>
        <input
          id="c-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={200}
          style={field}
        />
      </div>
      <div>
        <label htmlFor="c-message" style={label}>
          Message
        </label>
        <textarea
          id="c-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MAX_MESSAGE}
          style={{ ...field, resize: "vertical" }}
        />
      </div>
      {/* Honeypot — visually hidden, off-screen; a filled value means a bot. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        value={botcheck}
        onChange={(e) => setBotcheck(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />
      {error && (
        <p style={{ fontFamily: sans, fontSize: 14, color: "#b3261e", fontWeight: 600, margin: 0 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={!canSend}
        style={{
          fontFamily: sans,
          justifySelf: "start",
          padding: "12px 26px",
          borderRadius: 8,
          border: "none",
          background: canSend ? C.green : "#a7bdb4",
          color: C.paper,
          fontWeight: 600,
          fontSize: 15,
          cursor: canSend ? "pointer" : "default",
        }}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
