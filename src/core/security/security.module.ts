import { Module } from '@nestjs/common';
import { IdpModule } from './idp/idp.module';
import { AuthorizationModule } from './auth/authorization.module';

@Module({
  imports: [AuthorizationModule, IdpModule],
})
export class SecurityModule {}
