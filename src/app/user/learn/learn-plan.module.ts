import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';
import { LanguagesModule } from '@app/system/languages/languages.module';
import { LearnPlansController } from '@app/user/learn/plan/controller/user-learn-plan.controller';
import { LearnPlansService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { ProfileModule } from '@app/user/profiles/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, Language, UserLearnPlan]),
    LanguagesModule,
    ProfileModule,
  ],
  controllers: [LearnPlansController],
  providers: [LearnPlansService],
})
export class LearnPlanModule {}
