// Structured server-side run logging. Emits one JSON line per API run to
// stdout, which shows up in Vercel's runtime logs (free, no external service,
// and greppable / ready for a log drain later).
//
// IMPORTANT: log only metadata — never the pasted ad text, keyword, or URL — so
// the "the ad text you paste is not stored" promise on /about stays true. Input
// length is fine; input content is not.

type RunLog = {
  route: "generate" | "check";
  userId: string;
  ok: boolean;
  status: number;
  latencyMs: number;
  provider: string;
  inputLength: number;
  platform?: string;
  grounded?: boolean;
  source?: string;
  error?: string;
};

export function logRun(record: RunLog): void {
  console.log(JSON.stringify({ event: "run", ts: new Date().toISOString(), ...record }));
}

// Which LLM provider a run used, mirroring the auto-detection in the API routes.
export function currentProvider(): string {
  if (process.env.LLM_PROVIDER) return process.env.LLM_PROVIDER;
  if (process.env.GOOGLE_CLOUD_PROJECT) return "gemini";
  return "claude";
}
