import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLanguageDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  code: string;
}
