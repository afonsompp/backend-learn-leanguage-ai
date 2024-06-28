import { UserProfile } from '../entity/user-profile.entity';

export class ProfileDto {
  id: string;
  idProvider: string;
  nativeLanguage: string;

  constructor(profile: UserProfile) {
    this.id = profile.id;
    this.idProvider = profile.idProvider;
    this.nativeLanguage = profile.nativeLanguage.code;
  }
}
