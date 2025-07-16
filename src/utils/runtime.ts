export type Runtime = "node" | "bun" | "deno" | "cloudflare" | "unknown";

export function detectRuntime(): Runtime {
  if (typeof Bun !== "undefined") return "bun";
  if (typeof Deno !== "undefined" && typeof Deno.core !== "undefined") return "deno";
  if (typeof process !== "undefined" && process.release?.name === "node") return "node";
  if (typeof WebSocketPair !== "undefined" && typeof navigator === "undefined") return "cloudflare";

  return "unknown";
}
