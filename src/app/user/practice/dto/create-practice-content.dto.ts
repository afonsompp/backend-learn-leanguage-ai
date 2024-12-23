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
  learnPlanId: string;

  constructor(
    input: string,
    output: object,
    totalTokens: number,
    learnPlanId: string,
  ) {
    this.input = input;
    this.output = output;
    this.totalTokens = totalTokens;
    this.learnPlanId = learnPlanId;
  }
}
