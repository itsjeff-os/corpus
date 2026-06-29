import readline from "readline";
import { env } from "../config/env";
import { RyanCore } from "../ryan/core";

export function startCli() {
  const ryan = new RyanCore();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let isClosed = false;

  rl.on("close", () => {
    isClosed = true;
  });

  console.log("Redo Ryan Ready");
  console.log(`Using user=${env.ryanUserId} thread=${env.ryanThreadId}`);
  console.log("Ask something, or type /exit.\n");

  const ask = () => {
    if (isClosed) return;

    rl.question("> ", async (input) => {
      const trimmed = input.trim();
      if (["/exit", "exit", "quit"].includes(trimmed.toLowerCase())) {
        rl.close();
        return;
      }

      try {
        const result = await ryan.reply({ message: trimmed });
        console.log(`\n${result.reply}\n`);
        if (result.memory.degraded) {
          console.log(`[memory degraded for this turn: ${result.memory.error || "unknown Zep error"}]\n`);
        }
      } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
      }

      ask();
    });
  };

  ask();
}
