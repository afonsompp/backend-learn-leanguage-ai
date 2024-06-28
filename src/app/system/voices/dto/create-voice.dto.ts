import { IsGenderValid } from '../../../../core/decorators/voice/is-gender-valid.decorator';
import { IsString } from 'class-validator';

export class CreateVoiceDto {
  @IsString()
  name: string;
  @IsGenderValid()
  @IsString()
  gender: string;
  @IsString()
  languageCode: string;
}
