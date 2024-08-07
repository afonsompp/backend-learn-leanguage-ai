import { UserProfile } from '@app/user/profile/entity/user-profile.entity';

export class ProfileDto {
  id: string;
  userId: string;
  nativeLanguage: string;

  constructor(profile: UserProfile) {
    this.id = profile.id;
    this.userId = profile.userId;
    this.nativeLanguage = profile.nativeLanguage.code;
  }
}
