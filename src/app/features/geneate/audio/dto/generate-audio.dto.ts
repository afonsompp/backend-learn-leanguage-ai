import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GenerateAudioDto {
  @Expose({ name: 'text' })
  @IsString()
  text: string;
}
