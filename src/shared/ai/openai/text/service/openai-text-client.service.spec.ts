import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';
import { HttpClientService } from '@core/client/service/http-client.service';
import { OpenaiConfigService } from '@config/openai.config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatResponse } from '@shared/ai/openai/text/interface/chat-response';
import { HttpException } from '@nestjs/common';

describe('OpenaiTextClientService', () => {
  let service: OpenaiTextClientService;
  let httpClientService: HttpClientService;
  let openaiConfigService: OpenaiConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiTextClientService,
        {
          provide: HttpClientService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: OpenaiConfigService,
          useValue: {
            url: 'https://api.openai.com/v1',
            apiKey: 'test-api-key',
          },
        },
      ],
    }).compile();

    service = module.get<OpenaiTextClientService>(OpenaiTextClientService);
    httpClientService = module.get<HttpClientService>(HttpClientService);
    openaiConfigService = module.get<OpenaiConfigService>(OpenaiConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should make a successful chat request', async () => {
    const chatRequest: ChatRequest = {
      max_tokens: 0,
      stream: false,
      temperature: 0,
      top_p: 0,
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    };

    const chatResponse: ChatResponse = {
      system_fingerprint: '23123',
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: 1616824469,
      model: 'gpt-3.5-turbo',
      usage: {
        prompt_tokens: 9,
        completion_tokens: 11,
        total_tokens: 20,
      },
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Hi there!',
          },
          finish_reason: 'stop',
          index: 0,
        },
      ],
    };

    (httpClientService.post as jest.Mock).mockResolvedValue(chatResponse);

    const result = await service.chat(chatRequest);
    expect(result).toEqual(chatResponse);
    expect(httpClientService.post).toHaveBeenCalledWith(
      `${openaiConfigService.url}/chat/completions`,
      chatRequest,
      {
        headers: {
          Authorization: `Bearer ${openaiConfigService.apiKey}`,
        },
      },
    );
  });

  it('should handle errors from the OpenAI API', async () => {
    const chatRequest: ChatRequest = {
      max_tokens: 0,
      stream: false,
      temperature: 0,
      top_p: 0,
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    };

    (httpClientService.post as jest.Mock).mockImplementation(() => {
      throw new HttpException('Bad request', 400);
    });
    new Error('Failed to fetch data from OpenAI API');
    await expect(service.chat(chatRequest)).rejects.toStrictEqual(
      new HttpException('Failed to fetch data from OpenAI API', 400),
    );
  });

  it('should handle generic errors', async () => {
    const chatRequest: ChatRequest = {
      max_tokens: 0,
      stream: false,
      temperature: 0,
      top_p: 0,
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, world!' }],
    };

    (httpClientService.post as jest.Mock).mockImplementation(() => {
      throw new Error('Network error');
    });
    await expect(service.chat(chatRequest)).rejects.toStrictEqual(
      new HttpException('Failed to fetch data from OpenAI API', 500),
    );
  });
});
