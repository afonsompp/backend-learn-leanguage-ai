import { Test, TestingModule } from '@nestjs/testing';
import { BedrockService } from './bedrock.service';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const mockSend = jest.fn();

const mockBedrockClient = {
  send: mockSend,
};

describe('BedrockService', () => {
  let service: BedrockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BedrockService,
        {
          provide: BedrockRuntimeClient,
          useValue: mockBedrockClient,
        },
      ],
    }).compile();

    service = module.get<BedrockService>(BedrockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke model and return the generation result', async () => {
    const modelRequest = {
      prompt: 'Test prompt',
      maxLength: 100,
      temperature: 0.7,
      topP: 0.9,
      modelId: 'test-model',
    };

    const mockResponse = {
      body: new TextEncoder().encode(
        JSON.stringify({ generation: 'Generated response' }),
      ),
    };

    mockSend.mockResolvedValue(mockResponse);

    const result = await service.invokeModel(modelRequest);

    expect(mockSend).toHaveBeenCalledWith(expect.any(InvokeModelCommand));
    expect(result).toBe('Generated response');
  });

  it('should throw an error if invokeModel fails', async () => {
    const modelRequest = {
      prompt: 'Test prompt',
      maxLength: 100,
      temperature: 0.7,
      topP: 0.9,
      modelId: 'test-model',
    };

    mockSend.mockRejectedValue(new Error('Failed to invoke model'));

    await expect(service.invokeModel(modelRequest)).rejects.toThrow(
      'Failed to invoke model',
    );
  });
});
