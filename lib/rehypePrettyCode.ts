import type { Options } from "rehype-pretty-code";
import deepSpaceTheme from "@/lib/shikiTheme";

const rehypePrettyCodeOptions: Options = {
  theme: deepSpaceTheme,
  keepBackground: true,
  defaultLang: "text",
};

export default rehypePrettyCodeOptions;
