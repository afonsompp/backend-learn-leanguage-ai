import { PromptService } from './service/prompt.interface';
import { PromptLlamaService } from './service/llama/prompt-llama.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptFactoryService {
  buildPromptService(modelId: string): PromptService {
    switch (modelId) {
      case 'meta.llama2-13b-chat-v1':
      case 'meta.llama2-70b-chat-v1':
      case 'meta.llama3-8b-instruct-v1:0':
      case 'meta.llama3-70b-instruct-v1:0':
        return new PromptLlamaService();
      default:
        throw new Error(`Unsupported model id: ${modelId}`);
    }
  }
}
