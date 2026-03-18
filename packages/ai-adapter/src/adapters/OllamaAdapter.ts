import { BaseAIAdapter } from '../BaseAIAdapter';
import { AIContext, AIResponse } from '../types';

interface OllamaConfig {
  baseUrl?: string;
  model?: string;
}

export class OllamaAdapter extends BaseAIAdapter {
  name = 'Ollama';
  private config: Required<OllamaConfig>;

  constructor(config: OllamaConfig = {}) {
    super();
    this.config = {
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const contextStr = context.history
      .slice(-5)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const prompt = contextStr
      ? `Conversation context:\n${contextStr}\n\nUser: ${message}\nAssistant:`
      : `User: ${message}\nAssistant:`;

    const res = await fetch(`${this.config.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    return { text: data.response ?? '' };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.config.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }
}
