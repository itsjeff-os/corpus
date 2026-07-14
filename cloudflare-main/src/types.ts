/**
 * Environment bindings for Cloudflare Workers
 */
export interface Env {
  DB: D1Database;
  AI: Ai;
}

/**
 * Cloudflare AI binding interface
 * Note: The official @cloudflare/workers-types package provides the Ai type
 */
export interface Ai {
  run(model: string, inputs: any): Promise<any>;
}

/**
 * User interface
 */
export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

/**
 * Post interface
 */
export interface Post {
  id?: number;
  user_id: number;
  title: string;
  content: string;
  created_at?: string;
}

/**
 * AI Request interface
 */
export interface AIRequest {
  id?: number;
  user_id?: number;
  model: string;
  prompt: string;
  response?: string;
  tokens_used?: number;
  created_at?: string;
}
