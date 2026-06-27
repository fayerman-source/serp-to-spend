// Serialize structured data for a <script type="application/ld+json"> tag,
// escaping "<" so a "</script>" sequence in the data can never break out of
// the tag. The data here is static, but this keeps the pattern safe by default.
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
