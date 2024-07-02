import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { OpenaiConfigService } from '@config/openai.config.service';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ChatResponse } from '@core/ai/openai/text/interface/chat-response';

@Injectable()
export class OpenaiTextClientService {
  private logger = new Logger(OpenaiTextClientService.name);
  constructor(
    private httpService: HttpService,
    private openAIConfigService: OpenaiConfigService,
  ) {}

  async chat(chatRequest: ChatRequest): Promise<AxiosResponse<ChatResponse>> {
    try {
      const response = await this.httpService.post(
        `${this.openAIConfigService.url}/chat/completions`,
        chatRequest,
        {
          headers: {
            Authorization: `Bearer ${this.openAIConfigService.apiKey}`,
          },
        },
      );
      return await lastValueFrom(response.pipe());
    } catch (error) {
      this.logger.error('Error occurred while calling OpenAI API', error.stack);
      throw new HttpException(
        'Failed to fetch data from OpenAI API',
        error.response?.status || 500,
      );
    }
  }
}
