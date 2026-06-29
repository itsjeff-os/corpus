import { AppError } from "../utils/errors.js";

export class ToolService {
  async execute(name, args) {
    switch (name) {
      case "create_task":
        return this.createTask(args);
      default:
        throw new AppError(`Unknown tool: ${name}`, 400);
    }
  }

  async createTask(args) {
    return {
      ok: true,
      task: {
        id: `task_${Date.now()}`,
        title: args.title,
        due_date: args.due_date || null,
        notes: args.notes || ""
      }
    };
  }
}
