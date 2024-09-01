import { KnowledgeRating } from '@app/user/vocabulary/entity/knowledge-rating';
import { Word } from '@app/user/vocabulary/entity/word.entity';

export class WordDto {
  id: string;
  word: string;
  rating: KnowledgeRating;
  learnPlanId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(word: Word) {
    this.id = word.id;
    this.word = word.word;
    this.rating = word.rating;
    this.learnPlanId = word.learnPlan.id;
    this.createdAt = word.createdAt;
    this.updatedAt = word.updatedAt;
  }
}
