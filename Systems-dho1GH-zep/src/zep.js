import { ZepClient } from "@getzep/zep-cloud";

export const zep = new ZepClient({
  apiKey: process.env.ZEP_API_KEY,
});
