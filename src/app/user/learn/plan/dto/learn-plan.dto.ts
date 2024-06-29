import { UserLearnPlan } from '../entity/user-learn-plan.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

export class LearnPlanDto {
  id: string;
  userId: string;
  targetLanguage: string;
  level: LanguageLevel;

  constructor(userLearnPlan: UserLearnPlan) {
    this.id = userLearnPlan.id;
    this.userId = userLearnPlan.user.userId;
    this.targetLanguage = userLearnPlan.targetLanguage.code;
    this.level = userLearnPlan.level;
  }
}
