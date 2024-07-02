import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

export class CreateLearnPlanDto {
  userId: string;

  @IsString()
  @IsNotEmpty()
  targetLanguage: string;

  @IsEnum(LanguageLevel)
  @IsNotEmpty()
  level: LanguageLevel;
}
