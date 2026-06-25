import { describe, it, expect } from "vitest";
import { FTC } from "./ftc";
import { FDA } from "./fda";
import { META } from "./meta";
import { GOOGLE } from "./google";
import { TIKTOK } from "./tiktok";
import { buildTeardownSystem } from "../prompts/teardown";
import { GENERATE_SYSTEM } from "../prompts/generate";
import { PLATFORM_KNOWLEDGE, PLATFORM_MODULES } from "./index";

const MODULES = [FTC, FDA, META, GOOGLE, TIKTOK];

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

describe("shared platform registry", () => {
  it("maps all three platforms and lists all three modules", () => {
    expect(Object.keys(PLATFORM_KNOWLEDGE).sort()).toEqual(["Google", "Meta", "TikTok"]);
    expect(PLATFORM_MODULES).toHaveLength(3);
  });
});

describe("generate prompt is grounded in the same sourced modules", () => {
  it("composes every platform module + FTC, naming the real policies", () => {
    expect(GENERATE_SYSTEM).toContain("Unreliable Claims"); // real Google policy
    expect(GENERATE_SYSTEM).toContain("Health and Wellness"); // real Meta policy
    expect(GENERATE_SYSTEM).toContain("Misleading and False Content"); // real TikTok policy
    expect(GENERATE_SYSTEM).toContain("PUFFERY IS NOT A VIOLATION"); // shared FTC calibration
  });
});

describe("regulatory coverage: FTC earnings + FDA", () => {
  it("FTC module encodes the Business Opportunity Rule with its scope limit", () => {
    expect(FTC.knowledge).toContain("Part 437");
    expect(FTC.knowledge).toContain("255.2(b)");
    // the precise-scope guard so the model does not overclaim Part 437
    expect(FTC.knowledge.toLowerCase()).toContain("do not overclaim part 437");
  });
  it("FDA module names the drug-claim authority", () => {
    expect(FDA.knowledge).toContain("321(g)");
    expect(FDA.knowledge.toLowerCase()).toContain("disease");
  });
  it("both flows compose the FDA module", () => {
    expect(buildTeardownSystem("Meta")).toContain("FDA DRUG-CLAIM EXPOSURE");
    expect(GENERATE_SYSTEM).toContain("FDA DRUG-CLAIM EXPOSURE");
  });
});
