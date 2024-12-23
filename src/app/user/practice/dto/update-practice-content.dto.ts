import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePracticeContentDto {
  @IsString()
  @IsNotEmpty()
  audioEventStatus: string;
}
