import { Env, User, Post } from './types';

/**
 * Database operations for D1
 */
export class DatabaseService {
  constructor(private db: D1Database) {}

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM users ORDER BY created_at DESC')
      .all();
    return results as unknown as User[];
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const result = await this.db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first();
    return result as unknown as User | null;
  }

  /**
   * Create a new user
   */
  async createUser(name: string, email: string): Promise<User> {
    const result = await this.db
      .prepare('INSERT INTO users (name, email) VALUES (?, ?) RETURNING *')
      .bind(name, email)
      .first();
    return result as unknown as User;
  }

  /**
   * Update user
   */
  async updateUser(id: number, name: string, email: string): Promise<User | null> {
    const result = await this.db
      .prepare('UPDATE users SET name = ?, email = ? WHERE id = ? RETURNING *')
      .bind(name, email, id)
      .first();
    return result as unknown as User | null;
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db
      .prepare('DELETE FROM users WHERE id = ?')
      .bind(id)
      .run();
    return result.success;
  }

  /**
   * Get all posts
   */
  async getPosts(): Promise<Post[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM posts ORDER BY created_at DESC')
      .all();
    return results as unknown as Post[];
  }

  /**
   * Get posts by user ID
   */
  async getPostsByUserId(userId: number): Promise<Post[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC')
      .bind(userId)
      .all();
    return results as unknown as Post[];
  }

  /**
   * Create a new post
   */
  async createPost(userId: number, title: string, content: string): Promise<Post> {
    const result = await this.db
      .prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?) RETURNING *')
      .bind(userId, title, content)
      .first();
    return result as unknown as Post;
  }

  /**
   * Log AI request
   */
  async logAIRequest(
    userId: number | null,
    model: string,
    prompt: string,
    response: string,
    tokensUsed: number
  ): Promise<void> {
    await this.db
      .prepare(
        'INSERT INTO ai_requests (user_id, model, prompt, response, tokens_used) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(userId, model, prompt, response, tokensUsed)
      .run();
  }

  /**
   * Get AI request history
   */
  async getAIRequestHistory(limit: number = 10): Promise<any[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM ai_requests ORDER BY created_at DESC LIMIT ?')
      .bind(limit)
      .all();
    return results;
  }
}
