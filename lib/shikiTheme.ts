import type { ThemeRegistrationRaw } from "shiki";

const deepSpaceTheme: ThemeRegistrationRaw = {
  name: "deep-space",
  type: "dark",
  colors: {
    "editor.background": "#0d0d0d",
    "editor.foreground": "#d4d4d4",
  },
  settings: [],
  tokenColors: [
    {
      settings: {
        foreground: "#d4d4d4",
        background: "#0d0d0d",
      },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#525252" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: "#A06614" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
      ],
      settings: { foreground: "#B8896A" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
      ],
      settings: { foreground: "#D4A86A" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
      ],
      settings: { foreground: "#C49050" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
      ],
      settings: { foreground: "#B8896A" },
    },
    {
      scope: [
        "punctuation",
        "keyword.operator",
        "keyword.operator.assignment",
      ],
      settings: { foreground: "#737373" },
    },
    {
      scope: ["variable", "variable.other"],
      settings: { foreground: "#d4d4d4" },
    },
    {
      scope: [
        "entity.name.tag",
        "support.type.property-name.json",
      ],
      settings: { foreground: "#A06614" },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "string.regexp",
      ],
      settings: { foreground: "#B8896A" },
    },
    {
      scope: ["variable.parameter"],
      settings: { foreground: "#C49050" },
    },
    {
      scope: [
        "markup.heading",
        "entity.name.section",
      ],
      settings: { foreground: "#D4A86A" },
    },
    {
      scope: ["markup.bold"],
      settings: { foreground: "#d4d4d4", fontStyle: "bold" },
    },
    {
      scope: ["markup.italic"],
      settings: { foreground: "#d4d4d4", fontStyle: "italic" },
    },
    {
      scope: ["markup.list.numbered", "markup.list.unnumbered"],
      settings: { foreground: "#737373" },
    },
    {
      scope: ["meta.embedded", "source.groovy.embedded"],
      settings: { foreground: "#d4d4d4" },
    },
  ] as ThemeRegistrationRaw["tokenColors"],
};

export default deepSpaceTheme;
