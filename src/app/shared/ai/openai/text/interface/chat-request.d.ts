interface ChatRequest {
  model: string;
  messages: Message[];
  temperature: number;
  top_p: number;
  stream: boolean;
  max_tokens: number;
}
