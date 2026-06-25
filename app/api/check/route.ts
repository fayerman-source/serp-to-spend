import { NextResponse } from "next/server";
import { checkAd } from "@/lib/check";

export const runtime = "nodejs";
export const maxDuration = 60;

const PLATFORMS = ["Meta", "Google", "TikTok"] as const;
type Platform = (typeof PLATFORMS)[number];

export async function POST(req: Request) {
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

  try {
    const teardown = await checkAd(platform, ad);
    return NextResponse.json({ teardown });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
