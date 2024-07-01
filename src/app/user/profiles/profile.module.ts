import { Module } from '@nestjs/common';
import { UserProfileController } from './controller/user-profile.controller';
import { UserProfileService } from './service/user-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';
import { LanguagesModule } from '@app/system/languages/languages.module';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, Language]),
    LanguagesModule,
    AuthorizationModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class ProfileModule {}
