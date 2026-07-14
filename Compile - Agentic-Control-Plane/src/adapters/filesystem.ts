import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

export interface CorpusEntry {
  path: string;
  kind: "file" | "directory";
  trustLevel: "low" | "medium" | "high";
  classification: "current_instruction" | "confirmed_doc" | "historical_note" | "agent_output" | "unknown";
}

export async function inventoryCorpus(root: string, depth = 2): Promise<CorpusEntry[]> {
  const entries: CorpusEntry[] = [];
  await walk(root, depth, entries);
  return entries;
}

async function walk(path: string, depth: number, entries: CorpusEntry[]) {
  if (depth < 0) return;
  const info = await stat(path);
  const kind = info.isDirectory() ? "directory" : "file";
  entries.push({
    path,
    kind,
    trustLevel: classifyTrust(path),
    classification: classifyPath(path)
  });

  if (!info.isDirectory()) return;
  for (const child of await readdir(path)) {
    if (child === "node_modules" || child === ".git" || child === "dist") continue;
    await walk(join(path, child), depth - 1, entries);
  }
}

function classifyTrust(path: string): CorpusEntry["trustLevel"] {
  if (path.includes("confirmed") || path.endsWith("README.md")) return "high";
  if (path.includes("docs")) return "medium";
  return "low";
}

function classifyPath(path: string): CorpusEntry["classification"] {
  const lower = path.toLowerCase();
  if (lower.includes("agent") || lower.includes("llm")) return "agent_output";
  if (lower.includes("confirmed") || lower.includes("readme")) return "confirmed_doc";
  if (lower.includes("instruction") || lower.includes("policy")) return "current_instruction";
  if (lower.includes("archive") || lower.includes("old")) return "historical_note";
  return "unknown";
}
