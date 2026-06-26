// Builds the GoogleGenAI (Vertex AI) client options, resolving service-account
// credentials two ways:
//   - locally: a key file path in GOOGLE_APPLICATION_CREDENTIALS (Application
//     Default Credentials reads it automatically; nothing to pass here).
//   - on a serverless host like Vercel (no persistent secret file): the full
//     service-account JSON inline in GOOGLE_VERTEX_CREDENTIALS.
import { GoogleGenAI } from "@google/genai";

type VertexOptions = ConstructorParameters<typeof GoogleGenAI>[0];

export function vertexOptions(): VertexOptions {
  const options: VertexOptions = {
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1",
  };
  const inline = process.env.GOOGLE_VERTEX_CREDENTIALS;
  if (inline) {
    try {
      options.googleAuthOptions = { credentials: JSON.parse(inline) };
    } catch {
      throw new Error(
        "GOOGLE_VERTEX_CREDENTIALS is set but is not valid JSON. Paste the full service-account key.",
      );
    }
  }
  return options;
}
