// Serialize structured data for a <script type="application/ld+json"> tag.
// Escaping "<" to its JSON unicode form means a "</script>" sequence in the
// data can never break out of the tag. The data here is static, but this keeps
// the pattern safe by default. The backslash is built from its code point (92)
// so the source carries no escape sequence of its own.
const ESCAPED_LT = String.fromCodePoint(92) + "u003c";

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", ESCAPED_LT);
}
