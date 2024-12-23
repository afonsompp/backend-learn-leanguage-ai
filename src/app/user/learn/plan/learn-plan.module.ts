import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageModule } from '@app/system/language/language.module';
import { LearnPlansController } from '@app/user/learn/plan/controller/user-learn-plan.controller';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, UserLearnPlan]),
    LanguageModule,
  ],
  controllers: [LearnPlansController],
  providers: [LearnPlanService],
  exports: [LearnPlanService],
})
export class LearnPlanModule {}
