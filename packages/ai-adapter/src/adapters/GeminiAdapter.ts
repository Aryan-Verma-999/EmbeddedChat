import { BaseAIAdapter } from '../BaseAIAdapter';
import { AIContext, AIResponse, Message } from '../types';

interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiAdapter extends BaseAIAdapter {
  name = 'Gemini';
  private config: Required<GeminiConfig>;

  constructor(config: GeminiConfig) {
    super();
    this.config = {
      model: 'gemini-2.0-flash',
      ...config,
    };
  }

  private get endpoint() {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const historyParts = context.history.slice(-10).map((m) => ({
      role: 'user',
      parts: [{ text: `${m.u.username}: ${m.msg}` }],
    }));

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...historyParts,
          { role: 'user', parts: [{ text: message }] },
        ],
        systemInstruction: {
          parts: [
            {
              text: `You are a helpful assistant inside a chat room. Keep responses concise and relevant.${context.metadata?.federated ? ' This is a federated Matrix room.' : ''}`,
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return { text };
  }

  async getSuggestions(conversation: Message[]): Promise<string[]> {
    const ctx = conversation
      .slice(-5)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const res = await this.sendPrompt(
      { roomId: '', userId: '', history: conversation },
      `Based on this conversation, suggest exactly 3 short reply options. Reply with ONLY the 3 suggestions, one per line, no numbering, no explanation, max 10 words each:\n${ctx}`
    );

    return res.text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${this.config.apiKey}`
      );
      return res.ok;
    } catch {
      return false;
    }
  }
}
