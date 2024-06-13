import { Injectable } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

@Injectable()
export class BedrockService {
  constructor(private readonly bedrockClient: BedrockRuntimeClient) {}

  async converse(userMessage): Promise<string> {
    // Create a Bedrock Runtime client in the AWS Region of your choice.

    // Set the model ID, e.g., Llama 3 8B Instruct.
    const modelId = 'meta.llama3-8b-instruct-v1:0';

    // Embed the message in Llama 3's prompt format.
    const prompt = `
<|begin_of_text|>
<|start_header_id|>user<|end_header_id|>
${userMessage}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
`;

    // Format the request payload using the model's native structure.
    const request = {
      prompt,
      // Optional inference parameters:
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    };

    // Encode and send the request.
    const response = await this.bedrockClient.send(
      new InvokeModelCommand({
        contentType: 'application/json',
        body: JSON.stringify(request),
        modelId,
      }),
    );

    // Decode the native response body.
    /** @type {{ generation: string }} */
    const nativeResponse = JSON.parse(new TextDecoder().decode(response.body));

    // Extract and print the generated text.
    return nativeResponse.generation;
  }
}
