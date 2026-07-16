import { LayoutBlock } from "@rocket.chat/ui-kit";
import Ajv from "ajv";

export const UI_KIT_JSON_SCHEMA = {
  type: "object",
  properties: {
    componentType: {
      type: "string",
      enum: ["form", "profile", "gallery", "cta", "info"],
    },
    blocks: {
      type: "array",
      items: {
        anyOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", const: "divider" },
            },
            required: ["type"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "image" },
              imageUrl: { type: "string" },
              altText: { type: "string" },
            },
            required: ["type", "imageUrl", "altText"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "section" },
              text: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["plain_text", "mrkdwn"] },
                  text: { type: "string" },
                },
                required: ["type", "text"],
                additionalProperties: false,
              },
              accessory: {
                anyOf: [
                  { type: "null" },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "button" },
                      text: {
                        type: "object",
                        properties: {
                          type: { type: "string", const: "plain_text" },
                          text: { type: "string" },
                        },
                        required: ["type", "text"],
                        additionalProperties: false,
                      },
                      actionId: { type: "string" },
                      value: { type: "string" },
                    },
                    required: ["type", "text", "actionId", "value"],
                    additionalProperties: false,
                  },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "image" },
                      imageUrl: { type: "string" },
                      altText: { type: "string" },
                    },
                    required: ["type", "imageUrl", "altText"],
                    additionalProperties: false,
                  },
                ],
              },
            },
            required: ["type", "text", "accessory"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "actions" },
              elements: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", const: "button" },
                    text: {
                      type: "object",
                      properties: {
                        type: { type: "string", const: "plain_text" },
                        text: { type: "string" },
                      },
                      required: ["type", "text"],
                      additionalProperties: false,
                    },
                    actionId: { type: "string" },
                    value: { type: "string" },
                  },
                  required: ["type", "text", "actionId", "value"],
                  additionalProperties: false,
                },
              },
            },
            required: ["type", "elements"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "input" },
              element: {
                type: "object",
                properties: {
                  type: { type: "string", const: "plain_text_input" },
                  actionId: { type: "string" },
                  placeholder: {
                    anyOf: [
                      { type: "null" },
                      {
                        type: "object",
                        properties: {
                          type: { type: "string", const: "plain_text" },
                          text: { type: "string" },
                        },
                        required: ["type", "text"],
                        additionalProperties: false,
                      },
                    ],
                  },
                },
                required: ["type", "actionId", "placeholder"],
                additionalProperties: false,
              },
              label: {
                type: "object",
                properties: {
                  type: { type: "string", const: "plain_text" },
                  text: { type: "string" },
                },
                required: ["type", "text"],
                additionalProperties: false,
              },
            },
            required: ["type", "element", "label"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "context" },
              elements: {
                type: "array",
                items: {
                  anyOf: [
                    {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["plain_text", "mrkdwn"],
                        },
                        text: { type: "string" },
                      },
                      required: ["type", "text"],
                      additionalProperties: false,
                    },
                    {
                      type: "object",
                      properties: {
                        type: { type: "string", const: "image" },
                        imageUrl: { type: "string" },
                        altText: { type: "string" },
                      },
                      required: ["type", "imageUrl", "altText"],
                      additionalProperties: false,
                    },
                  ],
                },
              },
            },
            required: ["type", "elements"],
            additionalProperties: false,
          },
        ],
      },
    },
  },
  required: ["blocks", "componentType"],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(UI_KIT_JSON_SCHEMA);

export interface UIBlocksAndType {
  blocks: LayoutBlock[];
  componentType: string;
}

export function validateAndExtractBlocks(text: string): UIBlocksAndType {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e: any) {
    throw new Error(
      `Failed to parse AI layout response: ${e.message}. Response was: ${text}`
    );
  }

  if (parsed && Array.isArray(parsed.blocks)) {
    parsed.blocks = parsed.blocks.map((block: any) => {
      if (typeof block === "string") {
        try {
          return JSON.parse(block);
        } catch (_) {
          return block;
        }
      }
      return block;
    });
  }

  const valid = validate(parsed);
  if (!valid) {
    const errorText = ajv.errorsText(validate.errors);
    throw new Error(
      `AI layout response schema validation failed: ${errorText}. Response was: ${text}`
    );
  }

  return {
    blocks: parsed.blocks,
    componentType: parsed.componentType || "info",
  };
}
