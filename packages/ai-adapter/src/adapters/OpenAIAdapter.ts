import { LayoutBlock } from "@rocket.chat/ui-kit";
import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";
import {
  UI_KIT_JSON_SCHEMA,
  validateAndExtractBlocks,
} from "../utils/validation";

export interface OpenAIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class OpenAIAdapter extends BaseAIAdapter {
  name = "OpenAI";
  protected config: Required<OpenAIConfig>;

  constructor(config: OpenAIConfig) {
    super();
    this.config = {
      apiKey: "",
      model: "gpt-4o",
      maxTokens: 2000,
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

  protected buildResponseFormat(model: string): any {
    const strictCapableModels = [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "openai/gpt-oss-20b",
      "openai/gpt-oss-120b",
    ];

    const isStrictCapable = strictCapableModels.some((m) =>
      model.toLowerCase().includes(m.toLowerCase())
    );

    if (!isStrictCapable) {
      return { type: "json_object" };
    }

    return {
      type: "json_schema",
      json_schema: {
        name: "ui_kit_blocks",
        strict: true,
        schema: UI_KIT_JSON_SCHEMA,
      },
    };
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

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Prompt: "${prompt}"\n\nExisting Blocks:\n${JSON.stringify(
          existingBlocks || []
        )}`,
      },
    ];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const requestBody: any = {
      model: this.config.model,
      messages,
      max_tokens: this.config.maxTokens,
      response_format: this.buildResponseFormat(this.config.model),
    };

    // Retry up to 2 additional times on json_validate_failed 400s.
    // Per Groq's own documented guidance for strict: false json_schema mode:
    // json_validate_failed is a transient schema-enforcement failure, not an
    // auth or rate-limit error, and the recommended handling is to retry the
    // same request. Other non-2xx codes (auth, rate limit, server error) are
    // not retried and surface immediately.
    const MAX_ATTEMPTS = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        let bodyText = "";
        let errorCode: string | undefined;
        try {
          bodyText = await res.text();
          errorCode = JSON.parse(bodyText)?.error?.code;
        } catch (_) {}

        if (res.status === 400 && errorCode === "json_validate_failed" && attempt < MAX_ATTEMPTS) {
          // json_validate_failed — retry per Groq's documented pattern
          lastError = new Error(`OpenAI API error: ${res.status}. Response: ${bodyText}`);
          continue;
        }

        throw new Error(`OpenAI API error: ${res.status}. Response: ${bodyText}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      return validateAndExtractBlocks(text);
    }

    // All attempts exhausted — surface the last json_validate_failed error
    throw lastError ?? new Error("UI block generation failed after retries.");
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
