import { PromptTemplate } from '@app/system/prompt/entities/prompt-template.entity';

export class PromptDto {
  name: string;
  instruction: string;
  model: string;
  temperature: number;
  topP: number;
  stream: boolean;

  constructor(promptTemplate: PromptTemplate) {
    this.name = promptTemplate.name;
    this.instruction = promptTemplate.instruction;
    this.model = promptTemplate.model;
    this.temperature = promptTemplate.temperature;
    this.topP = promptTemplate.topP;
    this.stream = promptTemplate.stream;
  }
}
