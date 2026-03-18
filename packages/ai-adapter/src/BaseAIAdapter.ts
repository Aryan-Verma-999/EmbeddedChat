import { IAIAdapter, AIContext, AIResponse, Message } from './types';

export abstract class BaseAIAdapter implements IAIAdapter {
  abstract name: string;
  abstract sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  abstract isAvailable(): Promise<boolean>;

  async getSuggestions(conversation: Message[]): Promise<string[]> {
    const lastMessages = conversation
      .slice(-5)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const response = await this.sendPrompt(
      { roomId: '', userId: '', history: conversation },
      `Based on this conversation, suggest exactly 3 short reply options (one per line, no numbering, max 10 words each):\n${lastMessages}`
    );

    if (response.suggestions && response.suggestions.length > 0) {
      return response.suggestions;
    }

    return response.text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  async summarize(messages: Message[]): Promise<string> {
    const content = messages
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const response = await this.sendPrompt(
      { roomId: '', userId: '', history: messages },
      `Summarize this conversation concisely in 3-5 sentences:\n${content}`
    );

    return response.text;
  }
}
