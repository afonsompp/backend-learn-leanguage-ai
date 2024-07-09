import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdatePracticeTypeDto {
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  topP: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2)
  temperature: number;
}
