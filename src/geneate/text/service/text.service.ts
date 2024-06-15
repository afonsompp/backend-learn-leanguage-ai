import { Injectable } from '@nestjs/common';
import { BedrockService } from '../../../shared/aws/bedrock/service/bedrock.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { PromptFactory } from '../../../shared/prompt/factory/prompt-factory.service';

@Injectable()
export class TextService {
  constructor(
    private readonly bedrockService: BedrockService,
    private readonly promptFactory: PromptFactory,
  ) {}

  async create(request: GenerateTextDto): Promise<string> {
    const contents = request.buildContent();
    const promptService = this.promptFactory.getInstance(
      request.options.modelId,
    );

    const prompt = promptService.createPrompt(contents);

    const response = await this.bedrockService.invokeModel({
      prompt,
      ...request.options,
    });

    return this.formatResponse(response);
  }

  private formatResponse(result: string): string {
    return result.replace('\n\n', '\n');
  }
}
