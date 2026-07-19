import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ground } from "@/lib/serp";
import { generateAdPack } from "@/lib/generate";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  // Login required: every run costs a SerpApi + LLM call, so reject anonymous
  // requests before doing any billable work.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to generate ads." }, { status: 401 });
  }

  let input: string;
  let useSearch: boolean;
  try {
    const body = (await req.json()) as { input?: string; ground?: boolean };
    input = (body.input ?? "").trim();
    useSearch = body.ground !== false; // default on
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!input) {
    return NextResponse.json({ error: "Provide a keyword or a URL." }, { status: 400 });
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
    const grounding = await ground(input, { useSearch });
    const pack = await generateAdPack(grounding);
    return NextResponse.json({ source: grounding.source, query: grounding.query, pack });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
