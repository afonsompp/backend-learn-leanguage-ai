import { Module } from '@nestjs/common';
import { ProfileModule } from './profiles/profile.module';
import { LanguagesModule } from '../system/languages/languages.module';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [LanguagesModule, ProfileModule, AuthorizationModule],
})
export class UserModule {}
