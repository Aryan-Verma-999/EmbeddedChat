import React from 'react';
import { EmbeddedChat } from '..';

// Inline Ollama adapter — points to remote Ollama instance by default.
// Override: STORYBOOK_OLLAMA_URL=http://localhost:11434 yarn storybook
const OLLAMA_BASE_URL =
  process.env.STORYBOOK_OLLAMA_URL || 'https://ai.aryanverma.dev';
const OLLAMA_MODEL = process.env.STORYBOOK_OLLAMA_MODEL || 'qwen2:0.5b';

const chat = async (system, userMsg) => {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      options: { temperature: 0.3 },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
    }),
  });
  const data = await res.json();
  return data.message?.content ?? '';
};

const ollamaAdapter = {
  name: 'Ollama',
  isAvailable: async () => {
    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  },
  getSuggestions: async (conversation) => {
    const ctx = conversation
      .slice(-6)
      .map((m) => `${m.u.name || m.u.username}: ${m.msg}`)
      .join('\n');
    const text = await chat(
      'You are a chat assistant. When given recent chat messages, reply with exactly 3 very short reply options — one per line, no numbering, no bullet points, no explanation. Each reply must be under 8 words and sound natural.',
      `Recent messages:\n${ctx}\n\nGive 3 reply options:`
    );
    return text
      .split('\n')
      .map((s) => s.replace(/^[-•\d.)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
  },
  summarize: async (messages) => {
    const content = messages
      .map((m) => `${m.u.name || m.u.username}: ${m.msg}`)
      .join('\n');
    return chat(
      'You are a concise chat summarizer. Summarize the key points of the conversation in 2-4 clear sentences. Focus on what was discussed and any decisions made. Do not describe the messages meta.',
      `Chat messages:\n${content}\n\nSummary:`
    );
  },
  sendPrompt: async (context, message) => {
    const ctx = context.history
      .slice(-5)
      .map((m) => `${m.u.name || m.u.username}: ${m.msg}`)
      .join('\n');
    const text = await chat(
      'You are a helpful assistant embedded in a chat room. Keep answers concise and relevant to the conversation.',
      ctx ? `Context:\n${ctx}\n\nQuestion: ${message}` : message
    );
    return { text };
  },
};

export default {
  title: 'EmbeddedChat/WithAIAdapter',
  component: EmbeddedChat,
};

// Sign in → ✨ for reply suggestions, 📝 to summarize the entire chat.
// Powered by Ollama (qwen2:0.5b) at ai.aryanverma.dev.
export const WithAIAdapter = {
  loaders: [async () => ({ adapter: ollamaAdapter })],
  render: (args, { loaded }) =>
    React.createElement(EmbeddedChat, { ...args, aiAdapter: loaded.adapter }),
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || '69bc6262ea3e60ec913c3ab2',
    channelName: 'general',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    auth: { flow: 'PASSWORD' },
    dark: false,
  },
};
