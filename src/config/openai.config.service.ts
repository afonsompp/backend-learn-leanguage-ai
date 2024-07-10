import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenaiConfigService {
  constructor(private configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get<string>('openai.apiKey');
  }

  get url(): string {
    return this.configService.get<string>('openai.url');
  }
}
