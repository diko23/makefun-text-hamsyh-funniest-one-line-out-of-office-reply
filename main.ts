import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPLY_LINE: string =
  "I'm away until Monday, practicing the rare corporate art of not knowing what's on fire.";

const MAX_CHARS = 160;

function validateReply(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length === 0 || /[\r\n]/.test(line) || [...line].length > MAX_CHARS) {
    throw new Error("Reply violates single-line 1..160 character gate");
  }
  return line;
}

function main(): void {
  const outputDir: string = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim() || "/output";
  const payload: Buffer = Buffer.from(validateReply(REPLY_LINE), "utf8");
  mkdirSync(outputDir, { recursive: true });
  const entryPath: string = join(outputDir, "entry.txt");
  writeFileSync(entryPath, payload, { mode: 0o644, flag: "w" });
  chmodSync(entryPath, 0o644);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
