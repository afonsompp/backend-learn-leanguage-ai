interface Choice {
  index: number;
  message: Message;
  logprobs?: null;
  finish_reason: string;
}
