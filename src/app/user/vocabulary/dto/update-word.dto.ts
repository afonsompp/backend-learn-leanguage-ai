import { IsEnum, IsString } from 'class-validator';
import { KnowledgeRating } from '@app/user/vocabulary/entity/knowledge-rating';

export class UpdateWordDto {
  @IsString()
  learnPlanId: string;
  @IsEnum(KnowledgeRating)
  rating: KnowledgeRating;
}
