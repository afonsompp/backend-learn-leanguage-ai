import { Voice } from '../entities/voice.entity';

export class VoiceDto {
  id: number;
  name: string;
  gender: string;
  languageId: number;

  constructor(voice: Voice) {
    this.id = voice.id;
    this.name = voice.name;
    this.gender = voice.gender;
    this.languageId = voice.language.id;
  }
}
