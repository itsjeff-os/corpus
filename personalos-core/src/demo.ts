import { PersonalOSCore } from "./core/orchestrator";
import { fromLocalInput } from "./adapters/local";

const core = new PersonalOSCore();

const workItem = core.submitIntake(
  fromLocalInput({
    userId: "demo-user",
    input: "Help me rethink my whole Personal OS, but let's pull on one thread first and turn it into a useful plan."
  })
);

console.log(JSON.stringify(workItem, null, 2));
