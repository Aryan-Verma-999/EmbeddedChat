import { LayoutBlock } from "@rocket.chat/ui-kit";
import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";
import {
  UI_KIT_JSON_SCHEMA,
  validateAndExtractBlocks,
} from "../utils/validation";

interface OllamaConfig {
  baseUrl?: string;
  model?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class OllamaAdapter extends BaseAIAdapter {
  name = "Ollama";
  private config: Required<OllamaConfig>;

  constructor(config: OllamaConfig = {}) {
    super();
    this.config = {
      baseUrl: "http://localhost:11434",
      model: "llama3",
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

    const base = this.config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: chatMessages,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.message?.content ?? "";
    return { text };
  }

  async generateUIBlocks(
    prompt: string,
    existingBlocks?: LayoutBlock[]
  ): Promise<{ blocks: LayoutBlock[]; componentType: string }> {
    const systemPrompt = `You are a Rocket.Chat UI-Kit Block generator.
Your goal is to generate or modify a list of UI-Kit layout blocks (JSON) according to the user's instructions.
You must return a JSON object with two root keys:
1. "blocks": an array of layout blocks. Each block in the array must be a direct JSON object, NOT a JSON-encoded string.
2. "componentType": a string from the enum ["form", "profile", "gallery", "cta", "info"] representing the category of the generated component.

Allowed block types:
1. "section": for displaying text with an optional accessory (like a button or image).
2. "actions": for holding interactive elements (like buttons).
3. "input": for forms (labels with plain_text_input element).
4. "divider": simple horizontal rule.
5. "image": block containing an image.
6. "context": small text/image elements for metadata.

Use a section's 'accessory' field only when a button or image is directly attached to that specific line of text (e.g. a 'Read more' link next to a paragraph). For standalone action buttons that aren't tied to specific text, always use a separate top-level 'actions' block instead.

Every 'section' block must include an explicit 'accessory' field in its JSON output — set it to null if there is no button or image accessory for that section. Never omit the accessory key entirely.

Every 'plain_text_input' element must include an explicit 'placeholder' field — set it to null if no placeholder is needed. Never omit the placeholder key entirely.

When using 'mrkdwn' type text, only use Slack-style markdown syntax (*bold*, _italic_, ~strikethrough~, \`code\`) — do not use standard Markdown heading syntax like #, ##, since it is not supported.

Field naming is camelCase throughout — this is mandatory, not optional. For image elements and blocks: use 'imageUrl' (not 'image_url') and 'altText' (not 'alt_text'). The 'image' block type does NOT have a 'title' field — omit it entirely. For buttons and inputs: use 'actionId' (not 'action_id').

When an image block requires a placeholder photo, use https://picsum.photos/seed/{unique-word}/400/400 with a different seed word per image — this returns a real photo, not a broken link.

If asked for something with no direct schema match — such as a media gallery, video, or file list — represent it using the closest available primitive: a 'context' block with multiple 'image' elements for a thumbnail-style list, or a 'section' with descriptive text. Never attempt a block type not explicitly listed above.

If existingBlocks is provided, you must update, add to, or modify that list of blocks based on the prompt.`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Prompt: "${prompt}"\n\nExisting Blocks:\n${JSON.stringify(
          existingBlocks || []
        )}`,
      },
    ];

    const base = this.config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: chatMessages,
        stream: false,
        format: UI_KIT_JSON_SCHEMA,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.message?.content ?? "";

    return validateAndExtractBlocks(text);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const base = this.config.baseUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/api/tags`, {
        headers: this.config.headers,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
