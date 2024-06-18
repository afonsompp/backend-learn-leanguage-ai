import { Injectable } from '@nestjs/common';
import { BedrockService } from '../../../shared/aws/bedrock/service/bedrock.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { PromptFactory } from '../../../shared/prompt/factory/prompt-factory.service';
import { Auth0IdpTokenService } from '../../../shared/authServer/auth0/idp/auth0-idp-token.service';
import { JwtUtils } from '../../../shared/utils/jwt/jwt-utils.service';

@Injectable()
export class TextService {
  constructor(
    private readonly bedrockService: BedrockService,
    private readonly promptFactory: PromptFactory,
    private readonly idpTokenService: Auth0IdpTokenService,
  ) {}

  async create(request: GenerateTextDto, token: string): Promise<string> {
    const contents = request.buildContent();
    const promptService = this.promptFactory.getInstance(
      request.options.modelId,
    );

    const prompt = promptService.createPrompt(contents);

    const response = await this.bedrockService.invokeModel({
      prompt,
      ...request.options,
    });

    const user = JwtUtils.getSub(token.split(' ')[1]);
    const result = await this.idpTokenService.getIdpToken(user);

    console.log(result);
    return this.formatResponse(response);
  }

  private formatResponse(result: string): string {
    return result.replace('\n\n', '\n');
  }
}
