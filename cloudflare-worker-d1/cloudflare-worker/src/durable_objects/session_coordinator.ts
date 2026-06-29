export class SessionCoordinator {
  constructor(private state: DurableObjectState, private env: unknown) {}

  async fetch(request: Request): Promise<Response> {
    return Response.json({ ok: true, durableObject: 'SessionCoordinator' });
  }
}
