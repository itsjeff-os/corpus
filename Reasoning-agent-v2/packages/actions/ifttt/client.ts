export class IftttActionClient {
  async proposeAction(action: unknown): Promise<{ requiresApproval: true; action: unknown }> {
    return { requiresApproval: true, action };
  }
}
