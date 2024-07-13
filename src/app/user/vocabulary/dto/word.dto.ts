import { KnowledgeLevel } from '@app/user/vocabulary/entity/knowledge-level';
import { Word } from '@app/user/vocabulary/entity/word.entity';

export class WordDto {
  id: string;
  word: string;
  level: KnowledgeLevel;
  practiceContentId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(word: Word) {
    this.id = word.id;
    this.word = word.word;
    this.level = word.level;
    this.practiceContentId = word.practiceContent.id;
    this.createdAt = word.createdAt;
    this.updatedAt = word.updatedAt;
  }
}
