// Serialize structured data for a <script type="application/ld+json"> tag.
// Escaping "<" to its JSON unicode form means a "</script>" sequence in the
// data can never break out of the tag. The data here is static, but this keeps
// the pattern safe by default. Built from char code 60 ("<") and 92 ("\") so
// the source carries no backslash escape of its own.
const LT = String.fromCharCode(60);
const ESCAPED_LT = String.fromCharCode(92) + "u003c";

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replaceAll(LT, ESCAPED_LT);
}
