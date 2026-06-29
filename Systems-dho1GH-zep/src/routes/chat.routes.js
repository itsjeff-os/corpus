import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";

export function createChatRouter(chatController) {
  const router = Router();

  router.post("/", asyncHandler(chatController.handle));

  return router;
}
