/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" })
    }

    if (url.pathname === "/triage") {
      return Response.json({
        message: "triage endpoint ready"
      })
    }

    return Response.json({
      name: "ship-core",
      status: "running",
      endpoints: [
        "/health",
        "/triage"
      ]
    })
  },
}