import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { RouterModule } from '@nestjs/core';
import { PracticeModule } from '@app/user/practice/practice.module';
import { LearnPlanModule } from '@app/user/learn/plan/learn-plan.module';
import { VocabularyModule } from '@app/user/vocabulary/vocabulary.module';

@Module({
  imports: [
    PracticeModule,
    LearnPlanModule,
    AuthorizationModule,
    RouterModule.register([
      {
        path: 'users',
        module: LearnPlanModule,
      },
      {
        path: 'users',
        module: PracticeModule,
      },
      {
        path: 'users',
        module: VocabularyModule,
      },
    ]),
  ],
})
export class UserModule {}
