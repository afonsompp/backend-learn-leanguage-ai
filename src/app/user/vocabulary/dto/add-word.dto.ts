import { KnowledgeLevel } from '@app/user/vocabulary/entity/knowledge-level';

export class AddWordDto {
  word: string;
  level: KnowledgeLevel;
  practiceContentId: string;
}
