import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { AIOptions } from './AIOptions.dto';

export class GenerateTextDto {
  @Expose({ name: 'text_language' })
  @IsString()
  textLanguage: string;
  @Expose({ name: 'native_language' })
  @IsString()
  nativeLanguage: string;
  @Expose({ name: 'experience' })
  @IsString()
  experience: string;
  @Expose({ name: 'text_description' })
  @IsString()
  textDescription: string;
  @Expose({ name: 'options' })
  @ValidateNested()
  @Type(() => AIOptions)
  options: AIOptions;
}
