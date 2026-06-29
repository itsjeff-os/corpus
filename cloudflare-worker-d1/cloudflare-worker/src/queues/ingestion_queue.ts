import type { Env } from '../types';

export async function handleIngestionQueue(message: Message, env: Env): Promise<void> {
  console.log('queue placeholder', 'ingestion_queue', message.id);
}
