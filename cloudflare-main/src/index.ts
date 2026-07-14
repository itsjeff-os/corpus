import { Env } from './types';
import { DatabaseService } from './database';
import { AIService } from './ai';

/**
 * Main Cloudflare Worker
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Initialize services
    const db = new DatabaseService(env.DB);
    const ai = new AIService(env.AI);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check
      if (path === '/' && method === 'GET') {
        return jsonResponse({
          status: 'ok',
          message: 'Cloudflare Workers with D1 and AI Gateway',
          endpoints: {
            users: '/users',
            posts: '/posts',
            ai: '/ai',
          },
        }, corsHeaders);
      }

      // ===== User endpoints =====
      if (path === '/users' && method === 'GET') {
        const users = await db.getUsers();
        return jsonResponse({ users }, corsHeaders);
      }

      if (path.startsWith('/users/') && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const user = await db.getUserById(id);
        if (!user) {
          return jsonResponse({ error: 'User not found' }, corsHeaders, 404);
        }
        return jsonResponse({ user }, corsHeaders);
      }

      if (path === '/users' && method === 'POST') {
        const body = await request.json() as { name: string; email: string };
        if (!body.name || !body.email) {
          return jsonResponse({ error: 'Name and email are required' }, corsHeaders, 400);
        }
        const user = await db.createUser(body.name, body.email);
        return jsonResponse({ user }, corsHeaders, 201);
      }

      if (path.startsWith('/users/') && method === 'PUT') {
        const id = parseInt(path.split('/')[2]);
        const body = await request.json() as { name: string; email: string };
        if (!body.name || !body.email) {
          return jsonResponse({ error: 'Name and email are required' }, corsHeaders, 400);
        }
        const user = await db.updateUser(id, body.name, body.email);
        if (!user) {
          return jsonResponse({ error: 'User not found' }, corsHeaders, 404);
        }
        return jsonResponse({ user }, corsHeaders);
      }

      if (path.startsWith('/users/') && method === 'DELETE') {
        const id = parseInt(path.split('/')[2]);
        const success = await db.deleteUser(id);
        if (!success) {
          return jsonResponse({ error: 'User not found' }, corsHeaders, 404);
        }
        return jsonResponse({ message: 'User deleted successfully' }, corsHeaders);
      }

      // ===== Post endpoints =====
      if (path === '/posts' && method === 'GET') {
        const userId = url.searchParams.get('user_id');
        const posts = userId 
          ? await db.getPostsByUserId(parseInt(userId))
          : await db.getPosts();
        return jsonResponse({ posts }, corsHeaders);
      }

      if (path === '/posts' && method === 'POST') {
        const body = await request.json() as { user_id: number; title: string; content: string };
        if (!body.user_id || !body.title || !body.content) {
          return jsonResponse({ error: 'user_id, title, and content are required' }, corsHeaders, 400);
        }
        const post = await db.createPost(body.user_id, body.title, body.content);
        return jsonResponse({ post }, corsHeaders, 201);
      }

      // ===== AI endpoints =====
      if (path === '/ai/generate' && method === 'POST') {
        const body = await request.json() as { prompt: string; model?: string; user_id?: number };
        if (!body.prompt) {
          return jsonResponse({ error: 'Prompt is required' }, corsHeaders, 400);
        }

        const response = await ai.generateText(body.prompt, body.model);
        
        // Log the AI request
        // Note: Cloudflare AI responses don't currently include token usage metadata
        // Setting tokens_used to 0 as a placeholder until this information becomes available
        if (body.user_id) {
          await db.logAIRequest(
            body.user_id,
            body.model || '@cf/meta/llama-2-7b-chat-int8',
            body.prompt,
            JSON.stringify(response),
            0
          );
        }

        return jsonResponse({ response }, corsHeaders);
      }

      if (path === '/ai/classify' && method === 'POST') {
        const body = await request.json() as { text: string };
        if (!body.text) {
          return jsonResponse({ error: 'Text is required' }, corsHeaders, 400);
        }

        const response = await ai.classifyText(body.text);
        return jsonResponse({ response }, corsHeaders);
      }

      if (path === '/ai/embeddings' && method === 'POST') {
        const body = await request.json() as { text: string | string[] };
        if (!body.text) {
          return jsonResponse({ error: 'Text is required' }, corsHeaders, 400);
        }

        const response = await ai.generateEmbeddings(body.text);
        return jsonResponse({ response }, corsHeaders);
      }

      if (path === '/ai/translate' && method === 'POST') {
        const body = await request.json() as { 
          text: string; 
          source_lang: string; 
          target_lang: string 
        };
        if (!body.text || !body.source_lang || !body.target_lang) {
          return jsonResponse({ 
            error: 'Text, source_lang, and target_lang are required' 
          }, corsHeaders, 400);
        }

        const response = await ai.translateText(body.text, body.source_lang, body.target_lang);
        return jsonResponse({ response }, corsHeaders);
      }

      if (path === '/ai/summarize' && method === 'POST') {
        const body = await request.json() as { text: string; max_length?: number };
        if (!body.text) {
          return jsonResponse({ error: 'Text is required' }, corsHeaders, 400);
        }

        const response = await ai.summarizeText(body.text, body.max_length);
        return jsonResponse({ response }, corsHeaders);
      }

      if (path === '/ai/history' && method === 'GET') {
        const limit = url.searchParams.get('limit');
        const history = await db.getAIRequestHistory(limit ? parseInt(limit) : 10);
        return jsonResponse({ history }, corsHeaders);
      }

      // 404 Not Found
      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
    } catch (error) {
      console.error('Error:', error);
      return jsonResponse(
        { error: 'Internal server error', message: (error as Error).message },
        corsHeaders,
        500
      );
    }
  },
};

/**
 * Helper function to create JSON responses
 */
function jsonResponse(data: any, headers: Record<string, string> = {}, status: number = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
