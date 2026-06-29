import type { Env } from '../types';

export async function handleSyncQueue(message: Message, env: Env): Promise<void> {
  console.log('queue placeholder', 'sync_queue', message.id);
}
