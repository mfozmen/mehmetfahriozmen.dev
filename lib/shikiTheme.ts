import type { ThemeRegistrationRaw } from "shiki";

type TokenRule = { scopes: string[]; color: string; fontStyle?: string };

function buildTokenColors(rules: TokenRule[]) {
  return rules.map(({ scopes, color, fontStyle }) => ({
    scope: scopes,
    settings: fontStyle ? { foreground: color, fontStyle } : { foreground: color },
  }));
}

const PALETTE = {
  fg: "#d4d4d4",
  bg: "#0d0d0d",
  comment: "#525252",
  keyword: "#A06614",
  string: "#B8896A",
  fn: "#D4A86A",
  type: "#C49050",
  punctuation: "#737373",
};

const tokenRules: TokenRule[] = [
  { scopes: ["comment", "punctuation.definition.comment"], color: PALETTE.comment },
  { scopes: ["keyword", "keyword.control", "storage.type", "storage.modifier"], color: PALETTE.keyword },
  { scopes: ["string", "string.quoted", "string.template"], color: PALETTE.string },
  { scopes: ["entity.name.function", "support.function", "meta.function-call"], color: PALETTE.fn },
  { scopes: ["entity.name.type", "entity.name.class", "support.type", "support.class"], color: PALETTE.type },
  { scopes: ["constant.numeric", "constant.language"], color: PALETTE.string },
  { scopes: ["punctuation", "keyword.operator", "keyword.operator.assignment"], color: PALETTE.punctuation },
  { scopes: ["variable", "variable.other"], color: PALETTE.fg },
  { scopes: ["entity.name.tag", "support.type.property-name.json"], color: PALETTE.keyword },
  { scopes: ["entity.other.attribute-name", "string.regexp"], color: PALETTE.string },
  { scopes: ["variable.parameter"], color: PALETTE.type },
  { scopes: ["markup.heading", "entity.name.section"], color: PALETTE.fn },
  { scopes: ["markup.bold"], color: PALETTE.fg, fontStyle: "bold" },
  { scopes: ["markup.italic"], color: PALETTE.fg, fontStyle: "italic" },
  { scopes: ["markup.list.numbered", "markup.list.unnumbered"], color: PALETTE.punctuation },
  { scopes: ["meta.embedded", "source.groovy.embedded"], color: PALETTE.fg },
];

const deepSpaceTheme: ThemeRegistrationRaw = {
  name: "deep-space",
  type: "dark",
  settings: [],
  colors: { "editor.background": PALETTE.bg, "editor.foreground": PALETTE.fg },
  tokenColors: [
    { settings: { foreground: PALETTE.fg, background: PALETTE.bg } },
    ...buildTokenColors(tokenRules),
  ] as ThemeRegistrationRaw["tokenColors"],
};

export default deepSpaceTheme;
export { PALETTE };
