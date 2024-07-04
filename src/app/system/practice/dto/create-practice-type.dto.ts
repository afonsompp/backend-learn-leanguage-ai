import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePracticeTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  instruction: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2)
  temperature: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP: number;
}
