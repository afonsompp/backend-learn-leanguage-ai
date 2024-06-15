import { PromptService } from '../prompt.interface';

export class PromptLlamaService implements PromptService {
  createPrompt(contents: Content[]) {
    const prompt = '<|begin_of_text|>';
    for (const content of contents) {
      prompt.concat(this.createInstruction(content));
    }
    return prompt;
  }

  private createInstruction(instruction: Content) {
    return `<|start_header_id|>${instruction.type}<|end_header_id|> ${instruction.text} <|eot_id|>`;
  }
}
