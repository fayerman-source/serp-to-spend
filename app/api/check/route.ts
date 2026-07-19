import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkAd } from "@/lib/check";
import { logRun, currentProvider } from "@/lib/log";

export const runtime = "nodejs";
export const maxDuration = 60;

const PLATFORMS = ["Meta", "Google", "TikTok"] as const;
type Platform = (typeof PLATFORMS)[number];

export async function POST(req: Request) {
  // Login required: the compliance check costs an LLM call, so reject anonymous
  // requests before doing any billable work.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to check an ad." }, { status: 401 });
  }

  let platform: Platform;
  let ad: string;
  try {
    const body = (await req.json()) as { platform?: string; ad?: string };
    ad = (body.ad ?? "").trim();
    platform = (PLATFORMS as readonly string[]).includes(body.platform ?? "")
      ? (body.platform as Platform)
      : "Meta";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!ad) {
    return NextResponse.json({ error: "Paste an ad to check." }, { status: 400 });
  }
  if (ad.length < 15) {
    return NextResponse.json(
      { error: "Ad is too short to assess. Paste a full ad (headline and body)." },
      { status: 400 },
    );
  }

  const hasProvider =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_VERTEX_PROJECT_ID;
  if (!hasProvider) {
    return NextResponse.json(
      {
        error:
          "No LLM provider configured. Set GOOGLE_CLOUD_PROJECT (Gemini on Vertex), ANTHROPIC_API_KEY, or ANTHROPIC_VERTEX_PROJECT_ID.",
      },
      { status: 500 },
    );
  }

  const startedAt = Date.now();
  try {
    const teardown = await checkAd(platform, ad);
    logRun({
      route: "check",
      userId,
      ok: true,
      status: 200,
      latencyMs: Date.now() - startedAt,
      provider: currentProvider(),
      inputLength: ad.length,
      platform,
    });
    return NextResponse.json({ teardown });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check failed.";
    logRun({
      route: "check",
      userId,
      ok: false,
      status: 502,
      latencyMs: Date.now() - startedAt,
      provider: currentProvider(),
      inputLength: ad.length,
      platform,
      error: message,
    });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
