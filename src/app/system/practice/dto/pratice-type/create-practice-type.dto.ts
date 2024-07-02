import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePracticeTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  instruction: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  topP: number;

  stream?: boolean;
}
