import { z } from "zod";

export const chatRequestSchema = z.object({
  userId: z.string().min(1),
  threadId: z.string().min(1),
  message: z.string().min(1).max(10000)
});
