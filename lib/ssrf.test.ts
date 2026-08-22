import { describe, it, expect } from "vitest";
import { assertPublicHttpUrl } from "./ssrf";

describe("assertPublicHttpUrl", () => {
  it("rejects non-http(s) protocols", async () => {
    await expect(assertPublicHttpUrl("file:///etc/passwd")).rejects.toThrow();
    await expect(assertPublicHttpUrl("ftp://example.com")).rejects.toThrow();
  });

  it("rejects malformed URLs", async () => {
    await expect(assertPublicHttpUrl("not a url")).rejects.toThrow();
  });

  it("rejects localhost", async () => {
    await expect(assertPublicHttpUrl("http://localhost/")).rejects.toThrow();
    await expect(assertPublicHttpUrl("http://foo.localhost/")).rejects.toThrow();
  });

  it("rejects loopback and private literal IPs", async () => {
    await expect(assertPublicHttpUrl("http://127.0.0.1/")).rejects.toThrow();
    await expect(assertPublicHttpUrl("http://10.0.0.5/")).rejects.toThrow();
    await expect(assertPublicHttpUrl("http://192.168.1.1/")).rejects.toThrow();
    await expect(assertPublicHttpUrl("http://172.16.0.1/")).rejects.toThrow();
  });

  it("rejects the cloud metadata endpoint", async () => {
    await expect(assertPublicHttpUrl("http://169.254.169.254/latest/meta-data/")).rejects.toThrow();
  });

  it("rejects IPv6 loopback and link-local", async () => {
    await expect(assertPublicHttpUrl("http://[::1]/")).rejects.toThrow();
    await expect(assertPublicHttpUrl("http://[fe80::1]/")).rejects.toThrow();
  });

  it("allows a public literal IP", async () => {
    await expect(assertPublicHttpUrl("http://8.8.8.8/")).resolves.toBeInstanceOf(URL);
  });
});
