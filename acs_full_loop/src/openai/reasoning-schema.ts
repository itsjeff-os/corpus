export const reasoningPayloadSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response_text: { type: "string" },
    claims: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          content: { type: "string" },
          certainty: { type: "string", enum: ["certain", "probable", "uncertain"] },
          scope: { type: "string", enum: ["turn", "thread", "project", "global"] }
        },
        required: ["content", "certainty", "scope"]
      }
    },
    artefacts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          kind: { type: "string", enum: ["code", "schema", "policy", "plan", "test", "none"] },
          content: { type: "string" }
        },
        required: ["name", "kind", "content"]
      }
    },
    selected_next_move: { type: ["string", "null"] },
    trace: {
      type: "object",
      additionalProperties: false,
      properties: {
        used_explicit_content: { type: "array", items: { type: "string" } },
        used_validated_signals: { type: "array", items: { type: "string" } },
        active_controls: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "Explicit Content Lock",
              "Build-State Lock",
              "Authority Delegation Lock",
              "Signal Validation Gate",
              "Response Mode Lock",
              "Object Contact Lock",
              "Output Non-Interference Lock",
              "Traceability Gate"
            ]
          }
        },
        blocked_paths: { type: "array", items: { type: "string" } }
      },
      required: ["used_explicit_content", "used_validated_signals", "active_controls", "blocked_paths"]
    }
  },
  required: ["response_text", "claims", "artefacts", "selected_next_move", "trace"]
} as const;
