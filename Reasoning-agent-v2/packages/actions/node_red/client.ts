export class NodeRedActionClient {
  async proposeAction(action: unknown): Promise<{ requiresApproval: true; action: unknown }> {
    return { requiresApproval: true, action };
  }
}
