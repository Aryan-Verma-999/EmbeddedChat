import { BaseAIAdapter } from '../BaseAIAdapter';
import { AIContext, AIResponse } from '../types';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
}

export class OpenAIAdapter extends BaseAIAdapter {
  name = 'OpenAI';
  private config: Required<OpenAIConfig>;

  constructor(config: OpenAIConfig) {
    super();
    this.config = {
      model: 'gpt-4o',
      maxTokens: 500,
      baseUrl: 'https://api.openai.com/v1',
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const systemPrompt = `You are a helpful assistant in a chat room.${context.metadata?.federated ? ' This is a federated Matrix room.' : ''} Keep responses concise.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.history.slice(-10).map((m) => ({
        role: 'user' as const,
        content: `${m.u.username}: ${m.msg}`,
      })),
      { role: 'user', content: message },
    ];

    const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices[0]?.message?.content ?? '';
    return { text };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.config.apiKey}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
