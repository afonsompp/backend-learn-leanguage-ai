import { Injectable } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  ConversationRole,
  ConverseCommand,
  Message,
} from '@aws-sdk/client-bedrock-runtime';

@Injectable()
export class BedrockService {
  constructor(private readonly bedrockClient: BedrockRuntimeClient) {}

  async converse(modelId: string, userMessage: string) {
    // Create a conversation array with the user's message
    const conversation: Message[] = [
      {
        role: ConversationRole.USER,
        content: [
          {
            text: userMessage,
          },
        ],
      },
    ];

    // Create a ConverseCommand with the provided parameters
    const command = new ConverseCommand({
      modelId,
      messages: conversation,
      inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
    });

    try {
      // Send the command to the model and wait for the response
      const response = await this.bedrockClient.send(command);

      // Extract and return the response text
      return response.output?.message?.content?.at(0)?.text;
    } catch (err) {
      // Handle errors gracefully
      throw new Error(`Can't invoke '${modelId}'. Reason: ${err}`);
    }
  }
}
