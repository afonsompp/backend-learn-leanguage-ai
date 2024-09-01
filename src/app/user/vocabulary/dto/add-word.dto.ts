import { KnowledgeRating } from '@app/user/vocabulary/entity/knowledge-rating';

export class AddWordDto {
  word: string;
  rating?: KnowledgeRating;
}
