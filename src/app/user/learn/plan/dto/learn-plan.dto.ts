import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';

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
