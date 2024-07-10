import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePracticeContentDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsObject()
  @IsNotEmpty()
  output: object;

  @IsNumber()
  @IsPositive()
  totalTokens: number;

  @IsString()
  @IsNotEmpty()
  practiceId: string;

  constructor(
    input: string,
    output: object,
    totalTokens: number,
    practiceId: string,
  ) {
    this.input = input;
    this.output = output;
    this.totalTokens = totalTokens;
    this.practiceId = practiceId;
  }
}
