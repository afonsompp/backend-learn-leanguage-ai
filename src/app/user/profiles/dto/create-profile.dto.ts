import { IsString } from 'class-validator';

export class CreateProfileDto {
  idProvider: string;

  @IsString()
  nativeLanguage: string;
}
