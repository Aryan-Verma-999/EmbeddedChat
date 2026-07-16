import { OpenAIAdapter, OpenAIConfig } from "./OpenAIAdapter";
import { UI_KIT_JSON_SCHEMA } from "../utils/validation";

export class GroqAdapter extends OpenAIAdapter {
  name = "Groq";

  constructor(config?: Partial<OpenAIConfig>) {
    super({
      baseUrl: "https://api.groq.com/openai/v1",
      model: "openai/gpt-oss-20b",
      ...config,
    });
  }

  protected override buildResponseFormat(model: string): any {
    if (model === "openai/gpt-oss-20b" || model === "openai/gpt-oss-120b") {
      // strict: false — Groq's own guidance for schemas with nested anyOf unions.
      // strict: true uses a token-level constrained decoder that can abort entirely
      // (returning failed_generation: "") when schema complexity exceeds its budget
      // on longer outputs. strict: false switches to post-generation validation,
      // which handles complex prompts more reliably. Per Groq's docs this does not
      // eliminate json_validate_failed 400s; see retry logic in generateUIBlocks.
      return {
        type: "json_schema",
        json_schema: {
          name: "ui_kit_blocks",
          strict: false,
          schema: UI_KIT_JSON_SCHEMA,
        },
      };
    }
    return { type: "json_object" };
  }
}
