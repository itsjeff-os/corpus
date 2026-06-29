export const tools = [
  {
    type: "function",
    name: "create_task",
    description: "Create a task for the user.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        due_date: { type: "string", description: "ISO date if available" },
        notes: { type: "string" }
      },
      required: ["title"]
    }
  }
];
