export function buildContextBlock({ zepContext, appContext = {} }) {
  const memoryText =
    typeof zepContext === "string"
      ? zepContext
      : zepContext?.context || zepContext?.message || "";

  const parts = [];

  if (appContext.userProfile) {
    parts.push(`User profile:\n${JSON.stringify(appContext.userProfile, null, 2)}`);
  }

  if (appContext.activeTask) {
    parts.push(`Active task:\n${JSON.stringify(appContext.activeTask, null, 2)}`);
  }

  if (memoryText) {
    parts.push(`Relevant memory from Zep:\n${memoryText}`);
  }

  return parts.join("\n\n").trim();
}
