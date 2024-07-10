import { OpenaiConfigService } from '@config/openai.config.service';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ChatResponse } from '@shared/ai/openai/text/interface/chat-response';
import { HttpClientService } from '@core/client/service/http-client.service';

@Injectable()
export class OpenaiTextClientService {
  private logger = new Logger(OpenaiTextClientService.name);
  constructor(
    private httpService: HttpClientService,
    private openAIConfigService: OpenaiConfigService,
  ) {}

  async chat(chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      return this.httpService.post<ChatResponse>(
        `${this.openAIConfigService.url}/chat/completions`,
        chatRequest,
        {
          headers: {
            Authorization: `Bearer ${this.openAIConfigService.apiKey}`,
          },
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
