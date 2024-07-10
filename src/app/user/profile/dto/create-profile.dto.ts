import { IsString } from 'class-validator';

export class CreateProfileDto {
  userId: string;

  @IsString()
  nativeLanguage: string;
}
