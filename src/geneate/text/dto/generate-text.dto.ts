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

  buildContent(): Content[] {
    return [
      {
        type: 'system',
        text: `you are a IA what will generate texts to user learn a new language based on parameters bellow`,
      },
      {
        type: 'system',
        text: `generate text in markdown with title and content`,
      },
      {
        type: 'system',
        text: `generate text in this language: ${this.textLanguage}`,
      },
      {
        type: 'system',
        text: `the user are ${this.experience} in language of text`,
      },
      {
        type: 'system',
        text: `user have this native language: ${this.nativeLanguage}`,
      },
      {
        type: 'user',
        text: this.textDescription,
      },
    ];
  }
}
