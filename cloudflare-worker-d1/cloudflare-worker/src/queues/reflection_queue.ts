import type { Env } from '../types';

export async function handleReflectionQueue(message: Message, env: Env): Promise<void> {
  console.log('queue placeholder', 'reflection_queue', message.id);
}
