import { Language } from '../entities/language.entity';

export class LanguageDto {
  id: number;
  code: string;
  name: string;

  constructor(language: Language) {
    this.id = language.id;
    this.code = language.code;
    this.name = language.name;
  }
}
