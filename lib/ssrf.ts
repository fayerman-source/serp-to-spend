// Guards outbound server-side fetches (e.g. grounding a "Generate ads" run off a
// user-submitted URL) against SSRF: a signed-in user pasting a URL that points at
// loopback, a private/link-local range, or a cloud metadata endpoint
// (169.254.169.254) instead of a real public page.
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const addr = ip.toLowerCase();
  if (addr === "::1") return true; // loopback
  if (addr === "::") return true; // unspecified
  if (addr.startsWith("fe80:")) return true; // link-local
  if (addr.startsWith("fc") || addr.startsWith("fd")) return true; // unique local fc00::/7
  // IPv4-mapped (::ffff:a.b.c.d) — check the embedded v4 address too.
  const mapped = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

function isPrivateIP(ip: string): boolean {
  return isIP(ip) === 6 ? isPrivateIPv6(ip) : isPrivateIPv4(ip);
}

// Resolves the hostname and rejects if it (or any resolved address) is private.
// Call this before every fetch AND before following any redirect, since DNS can
// resolve differently between calls (rebinding) and a redirect can point anywhere.
export async function assertPublicHttpUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error("Only http/https URLs are allowed.");
  }
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("URL resolves to a disallowed address.");
  }

  // If the hostname is itself a literal IP, check it directly; otherwise resolve.
  if (isIP(hostname)) {
    if (isPrivateIP(hostname)) throw new Error("URL resolves to a disallowed address.");
    return url;
  }

  let addresses: Array<{ address: string }>;
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new Error("Could not resolve URL.");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) {
    throw new Error("URL resolves to a disallowed address.");
  }
  return url;
}
