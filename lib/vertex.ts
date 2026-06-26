// Builds and memoizes the GoogleGenAI (Vertex AI) client. Service-account
// credentials resolve two ways:
//   - locally: a key file path in GOOGLE_APPLICATION_CREDENTIALS (Application
//     Default Credentials reads it automatically; nothing to pass here).
//   - on a serverless host like Vercel (no persistent secret file): the full
//     service-account JSON inline in GOOGLE_VERTEX_CREDENTIALS.
import { GoogleGenAI } from "@google/genai";

type VertexOptions = ConstructorParameters<typeof GoogleGenAI>[0];

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id?: string;
}

function isServiceAccountKey(v: unknown): v is ServiceAccountKey {
  return (
    typeof v === "object" && v !== null && "client_email" in v && "private_key" in v
  );
}

function buildOptions(): VertexOptions {
  const options: VertexOptions = {
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
  };
  const inline = process.env.GOOGLE_VERTEX_CREDENTIALS;
  if (inline) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(inline);
    } catch {
      throw new Error(
        "GOOGLE_VERTEX_CREDENTIALS is set but is not valid JSON. Paste the full service-account key.",
      );
    }
    if (!isServiceAccountKey(parsed)) {
      throw new Error(
        "GOOGLE_VERTEX_CREDENTIALS must be a service-account key object (with client_email and private_key).",
      );
    }
    options.googleAuthOptions = { credentials: parsed };
    // Derive the project from the key if it was not set explicitly.
    if (!options.project && parsed.project_id) options.project = parsed.project_id;
  }
  return options;
}

let cachedOptions: VertexOptions | null = null;
export function vertexOptions(): VertexOptions {
  cachedOptions ??= buildOptions();
  return cachedOptions;
}

let client: GoogleGenAI | null = null;
// One shared Vertex client for both the generation and grounding calls.
export function getGeminiClient(): GoogleGenAI {
  client ??= new GoogleGenAI(vertexOptions());
  return client;
}
