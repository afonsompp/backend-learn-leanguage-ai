import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePracticeDto {
  @IsUUID()
  @IsNotEmpty()
  practiceType: string;
}
