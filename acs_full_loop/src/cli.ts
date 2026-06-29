import { runAssistantTurn } from "./loop.js";

const [userId, chatId, ...messageParts] = process.argv.slice(2);
const message = messageParts.join(" ");

if (!userId || !chatId || !message) {
  console.error("Usage: npm run loop -- <userId> <chatId> <message>");
  process.exit(1);
}

const result = await runAssistantTurn({ userId, chatId, message });
console.log(JSON.stringify(result, null, 2));
