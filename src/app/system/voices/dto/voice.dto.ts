import { Voice } from '@app/system/voices/entities/voice.entity';

export class VoiceDto {
  id: number;
  name: string;
  gender: string;
  languageCode: string;

  constructor(voice: Voice) {
    this.id = voice.id;
    this.name = voice.name;
    this.gender = voice.gender;
    this.languageCode = voice.language.code;
  }
}
