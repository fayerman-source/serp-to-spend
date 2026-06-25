import { describe, it, expect } from "vitest";
import { FTC } from "./ftc";
import { META } from "./meta";
import { GOOGLE } from "./google";
import { TIKTOK } from "./tiktok";
import { buildTeardownSystem } from "../prompts/teardown";

const MODULES = [FTC, META, GOOGLE, TIKTOK];

describe("knowledge modules are well-formed", () => {
  for (const m of MODULES) {
    describe(m.name, () => {
      it("has a dated version", () => {
        expect(m.version).toMatch(/\d{4}-\d{2}-\d{2}/);
      });
      it("has non-empty prompt-ready knowledge", () => {
        expect(m.knowledge.length).toBeGreaterThan(100);
      });
      it("every source has a label, a citation, and a real https URL", () => {
        expect(m.sources.length).toBeGreaterThan(0);
        for (const s of m.sources) {
          expect(s.label).toBeTruthy();
          expect(s.citation).toBeTruthy();
          expect(s.url).toMatch(/^https:\/\//);
        }
      });
    });
  }
});

describe("FTC module encodes the load-bearing doctrines, with authority", () => {
  const k = FTC.knowledge.toLowerCase();
  it("leads with the puffery calibration", () => {
    expect(FTC.knowledge).toContain("PUFFERY IS NOT A VIOLATION");
  });
  it("names the verified authorities inline", () => {
    expect(k).toContain("15 u.s.c. 45(a)"); // FTC Act Section 5(a)
    expect(k).toContain("16 c.f.r. 255"); // Endorsement Guides
    expect(k).toContain("competent and reliable"); // health-claims standard
  });
});

describe("buildTeardownSystem composes FTC + only the relevant platform", () => {
  it("Google: FTC puffery + the real 'Unreliable Claims' policy, no Meta-only content", () => {
    const sys = buildTeardownSystem("Google");
    expect(sys).toContain("PUFFERY IS NOT A VIOLATION");
    expect(sys).toContain("Unreliable Claims");
    expect(sys).not.toContain("Privacy Violations and Personal Attributes"); // Meta-only
  });
  it("Meta: its Personal Attributes + Health and Wellness policies, no Google-only content", () => {
    const sys = buildTeardownSystem("Meta");
    expect(sys).toContain("Personal Attributes");
    expect(sys).toContain("Health and Wellness");
    expect(sys).not.toContain("Unacceptable Business Practices"); // Google-only
  });
  it("throws a clear error for an unknown platform instead of a TypeError", () => {
    // buildTeardownSystem is exported; guard against an unvalidated caller.
    expect(() => buildTeardownSystem("Snapchat" as unknown as "Meta")).toThrow(
      /Unknown platform/,
    );
  });
});
