import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";

interface OpenAIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class OpenAIAdapter extends BaseAIAdapter {
  name = "OpenAI";
  private config: Required<OpenAIConfig>;

  constructor(config: OpenAIConfig) {
    super();
    this.config = {
      apiKey: "",
      model: "gpt-4o",
      maxTokens: 500,
      baseUrl: "https://api.openai.com/v1",
      headers: {},
      assistantUsername: "",
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const systemPrompt = `You are a helpful assistant in a chat room.${
      context.metadata?.federated ? " This is a federated Matrix room." : ""
    } Keep responses concise.`;

    const history = context.history.slice(-10);
    const chatMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [{ role: "system", content: systemPrompt }];

    for (const m of history) {
      const role =
        this.config.assistantUsername &&
        m.u.username === this.config.assistantUsername
          ? "assistant"
          : "user";
      const content = `${m.u.username}: ${m.msg}`;

      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg && lastMsg.role === role) {
        lastMsg.content += `\n${content}`;
      } else {
        chatMessages.push({ role, content });
      }
    }

    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
      lastMsg.content += `\n${message}`;
    } else {
      chatMessages.push({ role: "user", content: message });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages: chatMessages,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices[0]?.message?.content ?? "";
    return { text };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        ...this.config.headers,
      };
      if (this.config.apiKey) {
        headers["Authorization"] = `Bearer ${this.config.apiKey}`;
      }
      const res = await fetch(`${this.config.baseUrl}/models`, { headers });
      return res.ok;
    } catch {
      return false;
    }
  }
}
