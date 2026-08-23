import { describe, it, expect } from "vitest";
import { resolvePublicHttpUrl } from "./ssrf";

describe("resolvePublicHttpUrl", () => {
  it("rejects non-http(s) protocols", async () => {
    await expect(resolvePublicHttpUrl("file:///etc/passwd")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("ftp://example.com")).rejects.toThrow();
  });

  it("rejects malformed URLs", async () => {
    await expect(resolvePublicHttpUrl("not a url")).rejects.toThrow();
  });

  it("rejects localhost", async () => {
    await expect(resolvePublicHttpUrl("http://localhost/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://foo.localhost/")).rejects.toThrow();
  });

  it("rejects loopback and private literal IPv4 addresses", async () => {
    await expect(resolvePublicHttpUrl("http://127.0.0.1/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://10.0.0.5/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://192.168.1.1/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://172.16.0.1/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://100.64.0.1/")).rejects.toThrow();
  });

  it("rejects the cloud metadata endpoint", async () => {
    await expect(resolvePublicHttpUrl("http://169.254.169.254/latest/meta-data/")).rejects.toThrow();
  });

  it("rejects multicast and reserved/broadcast IPv4 ranges", async () => {
    await expect(resolvePublicHttpUrl("http://224.0.0.1/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://255.255.255.255/")).rejects.toThrow();
  });

  it("rejects the RFC 2544 benchmarking range", async () => {
    await expect(resolvePublicHttpUrl("http://198.18.0.1/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://198.19.255.254/")).rejects.toThrow();
  });

  it("rejects IPv6 loopback and link-local, including brackets and the full fe80::/10 range", async () => {
    await expect(resolvePublicHttpUrl("http://[::1]/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://[fe80::1]/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://[fea0::1]/")).rejects.toThrow();
    await expect(resolvePublicHttpUrl("http://[febf::1]/")).rejects.toThrow();
  });

  it("rejects IPv4-mapped IPv6 private addresses", async () => {
    await expect(resolvePublicHttpUrl("http://[::ffff:127.0.0.1]/")).rejects.toThrow();
  });

  it("rejects IPv4 documentation, protocol-assignment, and 6to4-relay ranges", async () => {
    await expect(resolvePublicHttpUrl("http://192.0.0.1/")).rejects.toThrow(); // IETF protocol assignments
    await expect(resolvePublicHttpUrl("http://192.0.2.1/")).rejects.toThrow(); // TEST-NET-1
    await expect(resolvePublicHttpUrl("http://192.88.99.1/")).rejects.toThrow(); // 6to4 relay anycast
    await expect(resolvePublicHttpUrl("http://198.51.100.1/")).rejects.toThrow(); // TEST-NET-2
    await expect(resolvePublicHttpUrl("http://203.0.113.1/")).rejects.toThrow(); // TEST-NET-3
  });

  it("rejects IPv6 unique-local, documentation, and transition ranges", async () => {
    await expect(resolvePublicHttpUrl("http://[fd00::1]/")).rejects.toThrow(); // unique local
    await expect(resolvePublicHttpUrl("http://[2001:db8::1]/")).rejects.toThrow(); // documentation
    await expect(resolvePublicHttpUrl("http://[3fff::1]/")).rejects.toThrow(); // documentation (RFC 9637)
    await expect(resolvePublicHttpUrl("http://[2002::1]/")).rejects.toThrow(); // 6to4
    await expect(resolvePublicHttpUrl("http://[64:ff9b::1]/")).rejects.toThrow(); // NAT64 well-known (RFC 6052)
    await expect(resolvePublicHttpUrl("http://[64:ff9b:1::a00:1]/")).rejects.toThrow(); // NAT64 local-use (RFC 8215)
    await expect(resolvePublicHttpUrl("http://[100::1]/")).rejects.toThrow(); // discard-only
    await expect(resolvePublicHttpUrl("http://[ff02::1]/")).rejects.toThrow(); // multicast
  });

  it("gives up on a hostname resolution that outlives an already-aborted deadline", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      resolvePublicHttpUrl("http://example.com/", { signal: controller.signal }),
    ).rejects.toThrow("Request timed out.");
  });

  it("allows a public literal IPv4 address and returns it as the resolved address", async () => {
    const result = await resolvePublicHttpUrl("http://8.8.8.8/");
    expect(result.url).toBeInstanceOf(URL);
    expect(result.addresses).toEqual([{ address: "8.8.8.8", family: 4 }]);
  });

  it("allows a public bracketed IPv6 literal address, stripping the brackets in the result", async () => {
    const result = await resolvePublicHttpUrl("http://[2606:4700:4700::1111]/");
    expect(result.addresses).toEqual([{ address: "2606:4700:4700::1111", family: 6 }]);
  });

  it("allows an IPv4-mapped IPv6 literal whose embedded address is public", async () => {
    const result = await resolvePublicHttpUrl("http://[::ffff:8.8.8.8]/");
    expect(result.addresses).toEqual([{ address: "::ffff:808:808", family: 6 }]);
  });
});
