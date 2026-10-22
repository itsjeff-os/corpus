import { describe, expect, it, vi } from "vitest";
import { arrayBufferToBase64, base64ToPcm16 } from "./audio";

vi.stubGlobal("btoa", (value: string) => Buffer.from(value, "binary").toString("base64"));
vi.stubGlobal("atob", (value: string) => Buffer.from(value, "base64").toString("binary"));

describe("PCM transport encoding", () => {
  it("round-trips signed 16-bit samples", () => {
    const source = new Int16Array([-32768, -1, 0, 1, 32767]);
    const encoded = arrayBufferToBase64(source.buffer);
    expect(Array.from(base64ToPcm16(encoded))).toEqual(Array.from(source));
  });
});
