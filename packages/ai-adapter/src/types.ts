export interface Message {
  _id: string;
  msg: string;
  u: { _id: string; username: string };
  ts: Date;
}

export interface AIContext {
  roomId: string;
  userId: string;
  history: Message[];
  metadata?: {
    federated?: boolean;
  };
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
}

export interface IAIAdapter {
  name: string;
  sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  getSuggestions?(conversation: Message[]): Promise<string[]>;
  summarize?(messages: Message[]): Promise<string>;
  isAvailable(): Promise<boolean>;
}
