import { chatRequestSchema } from "../schemas/chat.schema.js";
import { AppError } from "../utils/errors.js";

export class ChatController {
  constructor({ chatService }) {
    this.chatService = chatService;
  }

  handle = async (req, res) => {
    const parsed = chatRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError("Invalid request body", 400, {
        issues: parsed.error.issues
      });
    }

    const result = await this.chatService.reply(parsed.data);
    res.json(result);
  };
}
