import { Injectable } from '@nestjs/common';
import { BedrockService } from '../../../shared/aws/bedrock/service/bedrock.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { PromptFactory } from '../../../shared/prompt/factory/prompt-factory.service';
import { IdpTokenService } from '../../../shared/security/idp/service/idp-token.service';

@Injectable()
export class TextService {
  constructor(
    private readonly bedrockService: BedrockService,
    private readonly promptFactory: PromptFactory,
    private readonly idpTokenService: IdpTokenService,
  ) {}

  async create(request: GenerateTextDto): Promise<string> {
    const contents = request.buildContent();
    const promptService = this.promptFactory.getInstance(
      request.options.modelId,
    );

    const prompt = promptService.createPrompt(contents);

    return await this.bedrockService.invokeModel({
      prompt,
      ...request.options,
    });
  }
}
