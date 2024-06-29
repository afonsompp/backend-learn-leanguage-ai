import { Module } from '@nestjs/common';
import { ProfileModule } from './profiles/profile.module';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { LearnPlanModule } from '@app/user/learn/learn-plan.module';

@Module({
  imports: [ProfileModule, LearnPlanModule, AuthorizationModule],
})
export class UserModule {}
