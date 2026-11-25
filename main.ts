import { mkdirSync, readdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// One-Line Slogan for a Solana Wallet Agent.
// The slogan: a wallet agent that does the chores, so the human doesn't have to.
// 19 words, 100 characters, one line — inside the 1-140 char gate and the 20-word cap.
const ENTRY =
  "One tap and your Solana wallet does the chores: swaps, sends, and saves, while you get on with life.";

// Fail-fast gate validation: single line, 1-140 chars, at most 20 words, UTF-8.
if (!ENTRY || ENTRY.trim().length === 0) {
  throw new Error("entry is empty");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.length < 1 || ENTRY.length > 140) {
  throw new Error(`entry length ${ENTRY.length} outside gate 1-140`);
}
const words = ENTRY.trim().split(/\s+/);
if (words.length > 20) {
  throw new Error(`entry has ${words.length} words, over the 20-word limit`);
}

mkdirSync("/output", { recursive: true });
// Empty /output contents only — never remove the directory itself (mounted dir).
for (const name of readdirSync("/output")) {
  rmSync(`/output/${name}`, { recursive: true, force: true });
}
writeFileSync("/output/entry.txt", ENTRY, "utf8");

// Post-write read-back verification: the file must match the entry byte for byte.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== ENTRY) {
  throw new Error("read-back mismatch: /output/entry.txt differs from the entry");
}
const sha = createHash("sha256").update(ENTRY, "utf8").digest("hex");
console.log(`wrote /output/entry.txt (${ENTRY.length} chars, ${words.length} words, sha256 ${sha})`);
