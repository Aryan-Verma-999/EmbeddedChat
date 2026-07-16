import { LayoutBlock } from "@rocket.chat/ui-kit";
import { IAIAdapter, AIContext, AIResponse, Message } from "./types";

export abstract class BaseAIAdapter implements IAIAdapter {
  abstract name: string;
  abstract sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  abstract generateUIBlocks(
    prompt: string,
    existingBlocks?: LayoutBlock[]
  ): Promise<{ blocks: LayoutBlock[]; componentType: string }>;
  abstract isAvailable(): Promise<boolean>;

  async getSuggestions(
    conversation: Message[],
    context?: AIContext
  ): Promise<string[]> {
    const lastMessages = conversation
      .slice(-5)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join("\n");

    const ctx: AIContext = context ?? {
      roomId: "",
      userId: "",
      history: conversation,
    };

    const response = await this.sendPrompt(
      ctx,
      `Based on this conversation, suggest exactly 3 short reply options (one per line, no numbering, max 10 words each):\n${lastMessages}`
    );

    if (response.suggestions && response.suggestions.length > 0) {
      return response.suggestions;
    }

    return response.text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  async summarize(messages: Message[], context?: AIContext): Promise<string> {
    const truncated = messages.slice(-100);
    const content = truncated
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join("\n");

    const ctx: AIContext = context ?? {
      roomId: "",
      userId: "",
      history: truncated,
    };

    const response = await this.sendPrompt(
      ctx,
      `Summarize this conversation concisely in 3-5 sentences:\n${content}`
    );

    return response.text;
  }
}
