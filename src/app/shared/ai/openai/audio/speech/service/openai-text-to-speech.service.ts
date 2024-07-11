import { HttpException, Injectable } from '@nestjs/common';
import { HttpClientService } from '@core/client/service/http-client.service';
import { OpenaiConfigService } from '@config/openai.config.service';
import { Readable } from 'typeorm/browser/platform/BrowserPlatformTools';

@Injectable()
export class OpenaiTextToSpeechService {
  constructor(
    private httpService: HttpClientService,
    private openAIConfigService: OpenaiConfigService,
  ) {}

  async speech(speechRequest: SpeechRequest): Promise<Readable> {
    try {
      return this.httpService.post<Readable>(
        `${this.openAIConfigService.url}/audio/speech`,
        speechRequest,
        {
          headers: {
            Authorization: `Bearer ${this.openAIConfigService.apiKey}`,
          },
          responseType: 'stream',
        },
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch data from OpenAI API',
        error.response?.status || 500,
      );
    }
  }
}
