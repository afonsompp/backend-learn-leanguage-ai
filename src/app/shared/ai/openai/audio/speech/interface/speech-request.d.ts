interface SpeechRequest {
  model: string;
  input: string;
  voice: 'alloy' | 'nova';
}
