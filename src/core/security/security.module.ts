import { Module } from '@nestjs/common';
import { AuthorizationModule } from './auth/authorization.module';

@Module({
  imports: [AuthorizationModule],
})
export class SecurityModule {}
