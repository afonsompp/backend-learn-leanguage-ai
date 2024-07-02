import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';

export class PracticeContentDto {
  id: string;
  input: string;
  output?: object;
  totalTokens?: number;
  createdAt: Date;

  constructor(practiceContent: PracticeContent) {
    this.id = practiceContent.id;
    this.input = practiceContent.input;
    this.output = practiceContent.output;
    this.totalTokens = practiceContent.totalTokens;
    this.createdAt = practiceContent.createdAt;
  }
}
