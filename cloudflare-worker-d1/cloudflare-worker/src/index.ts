import { routeRequest } from './routes/router';
import { SessionCoordinator } from './durable_objects/session_coordinator';
import { TaskCoordinator } from './durable_objects/task_coordinator';
import type { Env } from './types';

export { SessionCoordinator, TaskCoordinator };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return routeRequest(request, env, ctx);
  },

  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Received queue batch', batch.messages.length);
  }
};
