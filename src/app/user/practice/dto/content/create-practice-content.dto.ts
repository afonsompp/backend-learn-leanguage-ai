import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreatePracticeContentDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsObject()
  @IsNotEmpty()
  output: object;

  @IsString()
  @IsNotEmpty()
  practiceId: string;

  constructor(input: string, output: object) {
    this.input = input;
    this.output = output;
  }
}
