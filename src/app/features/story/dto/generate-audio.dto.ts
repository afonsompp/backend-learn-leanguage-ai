import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateAudioDto {
  @IsString()
  @IsNotEmpty()
  storyId: string;
}
