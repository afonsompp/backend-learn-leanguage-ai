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

  @IsString()
  @IsNotEmpty()
  responseType: string;

  @IsNotEmpty()
  responseSchema: Record<string, any>;

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
