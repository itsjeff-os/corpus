import OpenAI from "openai";
import { LedgerStore } from "../state/ledger";
import { extractSignals } from "../rituals/signals";
import { routeFrame } from "./frameRouter";
import { RitualEngine } from "../scheduler/ritualEngine";
import { runRitual } from "../rituals/operators";

const client = new OpenAI();

export class ReasoningAgent {
  constructor(
    private ledgerStore = new LedgerStore(),
    private ritualEngine = new RitualEngine(60),
    private model: string = "gpt-5.2"
  ) {}

  getLedger() {
    return this.ledgerStore.get();
  }

  async handleUserTurn(input: string) {
    // Turn bookkeeping
    this.ledgerStore.incrementTurn();
    const ledger = this.ledgerStore.get();

    // Signals + frame
    const signals = extractSignals(input);
    const frame = routeFrame(input, signals);

    this.ledgerStore.update({ frame });

    // Ritual planning
    const plan = this.ritualEngine.plan(this.ledgerStore.get(), frame, signals);

    // Run rituals (max 2)
    const ritualOutputs: Array<{ name: string; why: string; output: unknown }> = [];
    for (const item of plan) {
      const output = await runRitual(item.name, input, this.ledgerStore.get(), frame, this.model);
      ritualOutputs.push({ name: item.name, why: item.why, output });
      this.ledgerStore.pushRitual({
        name: item.name,
        why: item.why,
        output,
        createdAt: new Date().toISOString(),
      });
    }

    // Main LLM response (now informed by ritual outputs + ledger)
    const finalLedger = this.ledgerStore.get();

    const response = await client.responses.create({
      model: this.model,
      input: [
        { role: "system", content: "You are a collaborative systems architect. Be concise but deep." },
        {
          role: "developer",
          content:
            `FRAME=${frame}\n` +
            `LEDGER=${JSON.stringify(finalLedger)}\n` +
            `RITUAL_OUTPUTS=${JSON.stringify(ritualOutputs)}\n` +
            `Goal: continue the thread with continuity. If a ritual ran, integrate its insights naturally.`,
        },
        { role: "user", content: input },
      ],
    });

    return {
      frame,
      ritualsRun: ritualOutputs.map(r => ({ name: r.name, why: r.why })),
      ritualOutputs,
      outputText: response.output_text ?? "",
      ledger: this.ledgerStore.get(),
    };
  }
}
