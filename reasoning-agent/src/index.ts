import "dotenv/config"
import readline from "readline"
import OpenAI from "openai"

const client = new OpenAI()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log("Reasoning Agent Ready")
console.log("Ask something...\n")

function ask() {
  rl.question("> ", async (input) => {

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: input
    })

    console.log("\n", response.output_text)
    console.log("\n")

    ask()
  })
}

ask()
