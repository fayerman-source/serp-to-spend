// Guards outbound server-side fetches (e.g. grounding a "Generate ads" run off a
// user-submitted URL) against SSRF: a signed-in user pasting a URL that points at
// loopback, a private/link-local range, or a cloud metadata endpoint
// (169.254.169.254) instead of a real public page.
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

// WHATWG URL.hostname keeps the brackets on an IPv6 literal (e.g. "[::1]"), but
// node:net's isIP() and node:dns's lookup() both expect the bare address.
function stripBrackets(hostname: string): string {
  return hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
}

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
  if (a >= 224) return true; // 224.0.0.0/4 multicast + 240.0.0.0/4 reserved/broadcast
  return false;
}

// An IPv4-mapped IPv6 address (::ffff:a.b.c.d) — the embedded v4 address needs
// its own private-range check. Node's URL parser canonicalizes the dotted-quad
// tail into hex (e.g. "::ffff:127.0.0.1" becomes "::ffff:7f00:1"), so match
// both the dotted and hex forms rather than assuming one.
function extractMappedIPv4(addr: string): string | null {
  const dotted = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (dotted) return dotted[1];
  const hex = addr.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!hex) return null;
  const hi = Number.parseInt(hex[1], 16);
  const lo = Number.parseInt(hex[2], 16);
  return [hi >> 8, hi & 0xff, lo >> 8, lo & 0xff].join(".");
}

function isPrivateIPv6(ip: string): boolean {
  const addr = ip.toLowerCase();
  if (addr === "::1") return true; // loopback
  if (addr === "::") return true; // unspecified
  if (/^fe[89ab][0-9a-f]:/.test(addr)) return true; // link-local fe80::/10
  if (/^fe[c-f][0-9a-f]:/.test(addr)) return true; // deprecated site-local fec0::/10
  if (addr.startsWith("fc") || addr.startsWith("fd")) return true; // unique local fc00::/7
  const mapped = extractMappedIPv4(addr);
  if (mapped) return isPrivateIPv4(mapped);
  return false;
}

function isPrivateIP(ip: string): boolean {
  return isIP(ip) === 6 ? isPrivateIPv6(ip) : isPrivateIPv4(ip);
}

export type ResolvedAddress = { address: string; family: 4 | 6 };
export type ResolvedPublicUrl = { url: URL; addresses: ResolvedAddress[] };

// Resolves the hostname and rejects if it (or any resolved address) is private.
// Returns the resolved addresses too, so the caller can pin its connection to
// exactly these — resolving again inside fetch() would reopen a DNS-rebinding
// gap (attacker's DNS answers public here, private at connect time). Call this
// before every request AND before following any redirect.
export async function resolvePublicHttpUrl(rawUrl: string): Promise<ResolvedPublicUrl> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error("Only http/https URLs are allowed.");
  }
  const hostname = stripBrackets(url.hostname.toLowerCase());
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("URL resolves to a disallowed address.");
  }

  // If the hostname is itself a literal IP, check it directly; otherwise resolve.
  const literalFamily = isIP(hostname);
  if (literalFamily) {
    if (isPrivateIP(hostname)) throw new Error("URL resolves to a disallowed address.");
    return { url, addresses: [{ address: hostname, family: literalFamily as 4 | 6 }] };
  }

  let addresses: ResolvedAddress[];
  try {
    addresses = (await lookup(hostname, { all: true })) as ResolvedAddress[];
  } catch {
    throw new Error("Could not resolve URL.");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) {
    throw new Error("URL resolves to a disallowed address.");
  }
  return { url, addresses };
}
