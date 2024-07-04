import { PracticeType } from '@app/system/practice/entities/practice-type.entity';

export class PracticeTypeDto {
  id: string;
  name: string;
  instruction: string;
  model: string;
  temperature: number;
  topP: number;
  stream: boolean;

  constructor(practiceType: PracticeType) {
    this.id = practiceType.id;
    this.name = practiceType.name;
    this.instruction = practiceType.instruction;
    this.model = practiceType.model;
    this.temperature = practiceType.temperature;
    this.topP = practiceType.topP;
    this.stream = practiceType.stream;
  }
}
