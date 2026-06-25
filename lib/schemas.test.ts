import { describe, it, expect } from "vitest";
import { AD_PACK_SCHEMA, TEARDOWN_SCHEMA } from "./schemas";

type Node = {
  type?: string;
  additionalProperties?: boolean;
  properties?: Record<string, Node>;
  required?: string[];
  items?: Node;
};

// Every object must declare additionalProperties:false and every `required`
// entry must point at a real property (the constraints structured-output needs).
function assertValid(node: Node, path = "root") {
  if (node.type === "object") {
    expect(node.additionalProperties, `${path}: additionalProperties must be false`).toBe(false);
    const props = node.properties ?? {};
    for (const req of node.required ?? []) {
      expect(Object.keys(props), `${path}: required "${req}" must exist in properties`).toContain(
        req,
      );
    }
    for (const [key, child] of Object.entries(props)) assertValid(child, `${path}.${key}`);
  }
  if (node.type === "array" && node.items) assertValid(node.items, `${path}[]`);
}

describe("structured-output schemas are well-formed", () => {
  it("AD_PACK_SCHEMA", () => assertValid(AD_PACK_SCHEMA as unknown as Node));
  it("TEARDOWN_SCHEMA", () => assertValid(TEARDOWN_SCHEMA as unknown as Node));
});
