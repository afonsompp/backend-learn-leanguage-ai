import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class GenerateStoryTextDto {
  @IsString()
  @IsNotEmpty()
  theme: string;
  @IsNumber()
  @IsPositive()
  length: number;
  @IsUUID()
  @IsNotEmpty()
  practiceId: string;
}
