import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { LanguageModule } from '@app/system/language/language.module';
import { LearnPlansController } from '@app/user/learn/plan/controller/user-learn-plan.controller';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { ProfileModule } from '@app/user/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, Language, UserLearnPlan]),
    LanguageModule,
    ProfileModule,
  ],
  controllers: [LearnPlansController],
  providers: [LearnPlanService],
  exports: [LearnPlanService],
})
export class LearnPlanModule {}
