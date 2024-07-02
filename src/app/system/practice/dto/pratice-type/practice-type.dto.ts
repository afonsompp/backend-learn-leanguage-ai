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
    this.instruction = practiceType.name;
    this.model = practiceType.name;
    this.temperature = practiceType.temperature;
    this.topP = practiceType.topP;
    this.stream = practiceType.stream;
  }
}
