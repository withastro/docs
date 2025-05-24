#!/usr/bin/env node
import { execSync } from "node:child_process";
import { argv, exit } from "node:process";

const lang = argv[2] || "ja";
const config = `./textlint/${lang}/config.json`;
const glob   = `src/content/**/${lang}/**/*.{md,mdx}`;

try {
  execSync(`pnpm exec textlint -c ${config} "${glob}"`, {
    stdio: "inherit"
  });
} catch (e) {
  // textlint already printed details; just propagate exit code
  exit(e.status ?? 1);
}
