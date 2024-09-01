import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  responseType: string;

  @IsJSON()
  responseSchema: object;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2)
  temperature: number;
}
