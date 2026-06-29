import { createHash, randomUUID } from "node:crypto";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashActor(actorId?: string, threadId?: string) {
  return sha256(actorId?.trim() || threadId?.trim() || "anonymous");
}

export function createOpaqueToken() {
  return randomUUID().replaceAll("-", "");
}
