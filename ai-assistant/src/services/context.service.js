export class ContextService {
  constructor({ maxChars }) {
    this.maxChars = maxChars;
  }

  build({ zepContext, appContext = {} }) {
    const parts = [];

    if (appContext.userProfile) {
      parts.push(
        `User profile:\n${JSON.stringify(appContext.userProfile, null, 2)}`
      );
    }

    if (appContext.activeTask) {
      parts.push(
        `Active task:\n${JSON.stringify(appContext.activeTask, null, 2)}`
      );
    }

    const rawContext =
      typeof zepContext === "string"
        ? zepContext
        : zepContext?.context || "";

    if (rawContext) {
      parts.push(`Relevant context from Zep:\n${rawContext}`);
    }

    const combined = parts.join("\n\n").trim();

    if (combined.length <= this.maxChars) return combined;
    return combined.slice(0, this.maxChars);
  }
}
