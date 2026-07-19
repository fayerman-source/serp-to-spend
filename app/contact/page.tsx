import type { Metadata } from "next";
import { C, serif, sans, MAXW, Eyebrow, SiteHeader, SiteFooter } from "../ui";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact · SERP-to-Spend",
  description: "Questions, feedback, or feature requests for SERP-to-Spend — get in touch.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <SiteHeader active="/contact" />
      <main style={{ maxWidth: MAXW, margin: "0 auto", padding: "44px 28px 0", fontFamily: sans }}>
        <Eyebrow>Get in touch</Eyebrow>
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: "clamp(26px, 3.6vw, 38px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.ink,
            margin: "12px 0 0",
          }}
        >
          Questions, feedback, or a feature you need
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: C.body, margin: "14px 0 0", maxWidth: 620 }}>
          Found a policy call that looks wrong, want a platform or claim type covered, or thinking about
          using this with a team? Send a note — it goes straight to the builder.
        </p>
        <ContactForm />
      </main>
      <SiteFooter />
    </>
  );
}
