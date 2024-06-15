import { PromptService } from '../prompt.interface';

export class PromptLlama3Service implements PromptService {
  createPrompt(contents: Content[]) {
    let prompt = '<|begin_of_text|> ';
    contents.forEach((content) => {
      prompt += this.createInstruction(content);
    });
    prompt += '<|start_header_id|>assistant<|end_header_id|>';
    return prompt;
  }

  private createInstruction(instruction: Content) {
    return `<|start_header_id|>${instruction.type}<|end_header_id|> ${instruction.text} <|eot_id|>`;
  }
}
