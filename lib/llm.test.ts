import { describe, it, expect, afterEach } from "vitest";
import { stripMarkdown, provider } from "./llm";

describe("stripMarkdown", () => {
  it("removes asterisks and backticks", () => {
    expect(stripMarkdown("the *real* `secret`")).toBe("the real secret");
  });
  it("collapses runs of whitespace and trims", () => {
    expect(stripMarkdown("  too   many   spaces  ")).toBe("too many spaces");
  });
  it("leaves clean copy untouched", () => {
    expect(stripMarkdown("Buy now and save 20%")).toBe("Buy now and save 20%");
  });
});

describe("provider", () => {
  const original = {
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
  };
  function restore(key: "LLM_PROVIDER" | "GOOGLE_CLOUD_PROJECT") {
    const v = original[key];
    if (v === undefined) delete process.env[key];
    else process.env[key] = v;
  }
  afterEach(() => {
    restore("LLM_PROVIDER");
    restore("GOOGLE_CLOUD_PROJECT");
  });

  it("defaults to gemini when GOOGLE_CLOUD_PROJECT is set", () => {
    delete process.env.LLM_PROVIDER;
    process.env.GOOGLE_CLOUD_PROJECT = "some-project";
    expect(provider()).toBe("gemini");
  });
  it("defaults to claude with no GCP project and no override", () => {
    delete process.env.LLM_PROVIDER;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    expect(provider()).toBe("claude");
  });
  it("honors an explicit LLM_PROVIDER override", () => {
    process.env.LLM_PROVIDER = "claude";
    process.env.GOOGLE_CLOUD_PROJECT = "some-project";
    expect(provider()).toBe("claude");
  });
});
