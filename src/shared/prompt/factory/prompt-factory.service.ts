import { PromptService } from './service/prompt.interface';
import { PromptLlama3Service } from './service/llama/prompt-llama.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptFactory {
  getInstance(modelId: string): PromptService {
    switch (modelId) {
      case 'meta.llama3-8b-instruct-v1:0':
      case 'meta.llama3-70b-instruct-v1:0':
        return new PromptLlama3Service();
      default:
        throw new Error(`Unsupported model id: ${modelId}`);
    }
  }
}
