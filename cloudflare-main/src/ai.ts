import { Env, Ai } from './types';

/**
 * AI Gateway Service for Cloudflare Workers AI
 */
export class AIService {
  constructor(private ai: Ai) {}

  /**
   * Generate text using AI
   */
  async generateText(prompt: string, model: string = '@cf/meta/llama-2-7b-chat-int8'): Promise<any> {
    try {
      const response = await this.ai.run(model, {
        prompt: prompt,
      });
      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  /**
   * Text classification
   */
  async classifyText(text: string): Promise<any> {
    try {
      const response = await this.ai.run('@cf/huggingface/distilbert-sst-2-int8', {
        text: text,
      });
      return response;
    } catch (error) {
      console.error('Text classification error:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbeddings(text: string | string[]): Promise<any> {
    try {
      const response = await this.ai.run('@cf/baai/bge-base-en-v1.5', {
        text: text,
      });
      return response;
    } catch (error) {
      console.error('Embeddings generation error:', error);
      throw error;
    }
  }

  /**
   * Image classification
   */
  async classifyImage(imageData: ArrayBuffer): Promise<any> {
    try {
      const response = await this.ai.run('@cf/microsoft/resnet-50', {
        image: [...new Uint8Array(imageData)],
      });
      return response;
    } catch (error) {
      console.error('Image classification error:', error);
      throw error;
    }
  }

  /**
   * Translate text
   */
  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<any> {
    try {
      const response = await this.ai.run('@cf/meta/m2m100-1.2b', {
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
      });
      return response;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  /**
   * Summarize text
   */
  async summarizeText(text: string, maxLength: number = 1024): Promise<any> {
    try {
      const response = await this.ai.run('@cf/facebook/bart-large-cnn', {
        input_text: text,
        max_length: maxLength,
      });
      return response;
    } catch (error) {
      console.error('Summarization error:', error);
      throw error;
    }
  }
}
