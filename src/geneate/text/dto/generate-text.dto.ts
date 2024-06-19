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
        text: `
        you are a IA what will generate stories in json to user learn a new language;
        use this template to generate text '{"title":"","story":["sentence"]}'
        the assistant must generate only json as response, without suffix or prefix;
        user have this native language: ${this.nativeLanguage};
        generate text in this language: ${this.textLanguage};
        the user are ${this.experience} in language of text;
        `,
      },
      {
        type: 'user',
        text: this.textDescription,
      },
    ];
  }
}
