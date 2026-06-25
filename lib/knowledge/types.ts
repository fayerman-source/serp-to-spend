// A compliance knowledge module: prompt-ready guidance plus the verified
// authorities it is grounded in. One module per reviewer (FTC, Meta, Google,
// TikTok). Adding a new authority means adding a module of this shape, nothing
// else. Only verified authority belongs in `sources`.

export type Source = {
  label: string; // human-readable name of the authority
  citation: string; // the exact citation (statute, CFR section, or published policy name)
  url: string; // a real, reachable source URL
};

export type KnowledgeModule = {
  name: string;
  version: string; // ISO date; bump when the content changes
  knowledge: string; // the prompt-ready text composed into the system prompt
  sources: Source[]; // verified authorities backing `knowledge`
};
