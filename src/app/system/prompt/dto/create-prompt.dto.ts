import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePromptDto {
  @IsNotEmpty()
  @IsString()
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

  @IsNotEmpty()
  @IsBoolean()
  stream: boolean;
}
