import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { RouterModule } from '@nestjs/core';
import { PracticeModule } from '@app/user/practice/practice.module';
import { LearnPlanModule } from '@app/user/learn/plan/learn-plan.module';

@Module({
  imports: [
    ProfileModule,
    PracticeModule,
    LearnPlanModule,
    AuthorizationModule,
    RouterModule.register([
      {
        path: 'users',
        module: ProfileModule,
      },
      {
        path: 'users',
        module: LearnPlanModule,
      },
      {
        path: 'users/learnPlans/:learnPlanId',
        module: PracticeModule,
      },
    ]),
  ],
})
export class UserModule {}
