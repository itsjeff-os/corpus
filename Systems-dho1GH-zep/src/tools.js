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

export async function runTool(name, args) {
  switch (name) {
    case "create_task":
      return {
        ok: true,
        task: {
          id: `task_${Date.now()}`,
          title: args.title,
          due_date: args.due_date || null,
          notes: args.notes || ""
        }
      };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
