import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { PracticeContentDto } from '@app/user/practice/dto/content/practice-content.dto';

export class PracticeDto {
  id: string;
  practiceTypeId: string;
  learnPlan: LearnPlanDto;
  contentHistory?: PracticeContentDto[];

  constructor(practice: Practice) {
    this.id = practice.id;
    this.practiceTypeId = practice.practiceType.id;
    this.learnPlan = new LearnPlanDto(practice.learnPlan);
    this.contentHistory = practice.contentHistory
      ? practice.contentHistory.map(
          (content) => new PracticeContentDto(content),
        )
      : null;
  }
}
