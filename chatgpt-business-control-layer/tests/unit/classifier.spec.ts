import { describe, expect, it } from "vitest";
import { classifyRequest } from "../../src/pipeline/classifier";

describe("classifyRequest", () => {
  it("honors explicit knowledge mode", () => {
    expect(classifyRequest("Create a plan", "knowledge")).toBe("knowledge");
  });

  it("detects decision-support requests", () => {
    expect(classifyRequest("Recommend the best option with tradeoffs.", "auto")).toBe(
      "decision_support"
    );
  });

  it("detects write candidates", () => {
    expect(classifyRequest("Create an internal note about this outage.", "auto")).toBe(
      "write_candidate"
    );
  });
});
