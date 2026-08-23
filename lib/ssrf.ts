// Guards outbound server-side fetches (e.g. grounding a "Generate ads" run off a
// user-submitted URL) against SSRF: a signed-in user pasting a URL that points at
// loopback, a private/link-local range, or a cloud metadata endpoint
// (169.254.169.254) instead of a real public page.
//
// Classifies against the full IANA IPv4 and IPv6 Special-Purpose Address
// Registries (https://www.iana.org/assignments/iana-ipv4-special-registry/,
// .../iana-ipv6-special-registry/), not just the well-known RFC 1918 ranges —
// documentation ranges (TEST-NET, 2001:db8::/32), benchmarking (RFC 2544),
// 6to4/NAT64 transition ranges, and IETF protocol-assignment blocks can all be
// routed to internal services in a real deployment, so "not obviously private"
// is not the same as "safe to fetch."
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
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 0) return true; // 0.0.0.0/8 "this" network
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local incl. cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 0 && parts[2] === 0) return true; // 192.0.0.0/24 IETF protocol assignments
  if (a === 192 && b === 0 && parts[2] === 2) return true; // 192.0.2.0/24 TEST-NET-1 (documentation)
  if (a === 192 && b === 88 && parts[2] === 99) return true; // 192.88.99.0/24 6to4 relay anycast (deprecated)
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmarking (RFC 2544)
  if (a === 198 && b === 51 && parts[2] === 100) return true; // 198.51.100.0/24 TEST-NET-2 (documentation)
  if (a === 203 && b === 0 && parts[2] === 113) return true; // 203.0.113.0/24 TEST-NET-3 (documentation)
  if (a >= 224) return true; // 224.0.0.0/4 multicast + 240.0.0.0/4 reserved, incl. 255.255.255.255 broadcast
  return false;
}

// Expands a canonical (compressed, lowercase) IPv6 literal into its 8 16-bit
// groups. Both of our inputs are guaranteed canonical: URL.hostname produces
// the WHATWG-canonical form, and dns.lookup() returns getaddrinfo's canonical
// form — neither ever has leading zeros in a group or more than one "::".
function expandIPv6(addr: string): number[] | null {
  const doubleColon = addr.indexOf("::");
  let groups: string[];
  if (doubleColon !== -1) {
    const before = addr.slice(0, doubleColon);
    const after = addr.slice(doubleColon + 2);
    const beforeGroups = before ? before.split(":") : [];
    const afterGroups = after ? after.split(":") : [];
    const missing = 8 - (beforeGroups.length + afterGroups.length);
    if (missing < 0) return null;
    groups = [...beforeGroups, ...Array(missing).fill("0"), ...afterGroups];
  } else {
    groups = addr.split(":");
  }
  if (groups.length !== 8) return null;
  const nums = groups.map((g) => Number.parseInt(g, 16));
  return nums.some((n) => Number.isNaN(n) || n < 0 || n > 0xffff) ? null : nums;
}

function ipv4FromMappedHextets(h: number[]): string {
  return [h[6] >> 8, h[6] & 0xff, h[7] >> 8, h[7] & 0xff].join(".");
}

function isPrivateIPv6(ip: string): boolean {
  const h = expandIPv6(ip.toLowerCase());
  if (!h) return true; // couldn't parse a canonical literal — refuse rather than guess

  const allZero = h.every((n) => n === 0);
  if (allZero) return true; // :: unspecified
  if (h.slice(0, 7).every((n) => n === 0) && h[7] === 1) return true; // ::1 loopback

  if ((h[0] & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  if ((h[0] & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((h[0] & 0xffc0) === 0xfec0) return true; // fec0::/10 deprecated site-local
  if ((h[0] & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local

  if (h[0] === 0x2001 && h[1] === 0x0db8) return true; // 2001:db8::/32 documentation
  if (h[0] === 0x3fff && (h[1] & 0xf000) === 0) return true; // 3fff::/20 documentation (RFC 9637)
  if (h[0] === 0x2002) return true; // 2002::/16 6to4
  if (h[0] === 0x0064 && h[1] === 0xff9b && h.slice(2, 6).every((n) => n === 0)) return true; // 64:ff9b::/96 NAT64 well-known prefix (RFC 6052)
  if (h[0] === 0x0064 && h[1] === 0xff9b && h[2] === 0x0001) return true; // 64:ff9b:1::/48 NAT64 local-use prefix (RFC 8215)
  if (h[0] === 0x0100 && h.slice(1, 4).every((n) => n === 0)) return true; // 100::/64 discard-only

  // IPv4-mapped (::ffff:a.b.c.d, canonically "::ffff:HHHH:HHHH") — the fixed
  // ::ffff:0:0/96 prefix is groups 0-5 (with group 5 == 0xffff); the embedded
  // v4 address is the low 32 bits (groups 6-7) and needs its own check.
  if (h.slice(0, 5).every((n) => n === 0) && h[5] === 0xffff) {
    return isPrivateIPv4(ipv4FromMappedHextets(h));
  }
  return false;
}

function isPrivateIP(ip: string): boolean {
  return isIP(ip) === 6 ? isPrivateIPv6(ip) : isPrivateIPv4(ip);
}

// node:dns/promises' lookup() takes no AbortSignal, so an attacker-controlled
// hostname whose resolver just never answers can hang past any deadline the
// caller thinks it set. Race it against the signal instead — this can't cancel
// the in-flight lookup (Node has no hook for that), but it does let the caller
// give up and respond on time rather than hang for however long DNS takes.
function raceAgainstSignal<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new Error("Request timed out."));
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(new Error("Request timed out."));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (v) => {
        signal.removeEventListener("abort", onAbort);
        resolve(v);
      },
      (err) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      },
    );
  });
}

export type ResolvedAddress = { address: string; family: 4 | 6 };
export type ResolvedPublicUrl = { url: URL; addresses: ResolvedAddress[] };

// Resolves the hostname and rejects if it (or any resolved address) is private.
// Returns the resolved addresses too, so the caller can pin its connection to
// exactly these — resolving again inside fetch() would reopen a DNS-rebinding
// gap (attacker's DNS answers public here, private at connect time). Call this
// before every request AND before following any redirect.
export async function resolvePublicHttpUrl(
  rawUrl: string,
  opts?: { signal?: AbortSignal },
): Promise<ResolvedPublicUrl> {
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
    addresses = (await raceAgainstSignal(lookup(hostname, { all: true }), opts?.signal)) as ResolvedAddress[];
  } catch (err) {
    if (err instanceof Error && err.message === "Request timed out.") throw err;
    throw new Error("Could not resolve URL.");
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) {
    throw new Error("URL resolves to a disallowed address.");
  }
  return { url, addresses };
}
