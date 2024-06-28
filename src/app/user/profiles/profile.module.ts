import { Module } from '@nestjs/common';
import { UserProfileController } from './controller/user-profile.controller';
import { UserProfileService } from './service/user-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, Language])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class ProfileModule {}
