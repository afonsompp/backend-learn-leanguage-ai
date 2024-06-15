import { Injectable } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

@Injectable()
export class BedrockService {
  constructor(private readonly bedrockClient: BedrockRuntimeClient) {}

  async invokeModel(modelRequest: ModelRequest): Promise<string> {
    const request = {
      prompt: modelRequest.prompt,
      max_gen_len: modelRequest.maxLength,
      temperature: modelRequest.temperature,
      top_p: modelRequest.topP,
    };

    const response = await this.bedrockClient.send(
      new InvokeModelCommand({
        contentType: 'application/json',
        body: JSON.stringify(request),
        modelId: modelRequest.modelId,
      }),
    );

    const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));

    return nativeResponse.generation;
  }
}
