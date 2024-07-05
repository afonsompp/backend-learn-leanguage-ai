import { Injectable, Logger } from '@nestjs/common';
import { GenerateStoryTextDto } from '@app/features/story/text/generator/dto/generate-story-text.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';

@Injectable()
export class GenerateStoryTextService {
  private readonly logger = new Logger(GenerateStoryTextService.name);

  constructor(
    private readonly practiceService: PracticeService,
    private readonly openaiTextClientService: OpenaiTextClientService,
  ) {}

  async create(request: GenerateStoryTextDto, userId: string): Promise<string> {
    this.logger.log(
      `Generating story text for user: ${userId} with request: ${JSON.stringify(request)}`,
    );

    const practice = await this.practiceService.findOneById(
      request.practiceId,
      userId,
    );

    if (!practice) {
      this.logger.error(
        `Practice with ID ${request.practiceId} not found for user ${userId}`,
      );
      throw new Error(
        `Practice with ID ${request.practiceId} not found for user ${userId}`,
      );
    }

    const chatRequest = this.buildChatRequest(practice, request);

    const response = await this.openaiTextClientService.chat(chatRequest);

    if (!response.choices || response.choices.length === 0) {
      this.logger.error('No response choices from OpenAI');
      throw new Error('No response from OpenAI');
    }

    const storyText = response.choices[0].message.content;
    this.logger.log(`Generated story text: ${storyText}`);
    return storyText;
  }

  private buildChatRequest(
    practice: Practice,
    newStory: GenerateStoryTextDto,
  ): ChatRequest {
    const chatRequest = {
      model: practice.practiceType.model,
      messages: this.generateMessages(practice, newStory),
      temperature: practice.practiceType.temperature,
      top_p: practice.practiceType.topP,
      max_tokens: practice.practiceType.maxTokens,
      stream: practice.practiceType.stream,
    };
    this.logger.log(`Built chat request`);
    return chatRequest;
  }

  private generateMessages(
    practice: Practice,
    newStory: GenerateStoryTextDto,
  ): Message[] {
    const messages: Message[] = [
      {
        role: 'system',
        content: practice.practiceType.instruction,
      },
      {
        role: 'user',
        content: this.buildUserContextInfo(practice),
      },
    ];

    const historyMessages = practice.contentHistory.map(
      (content): Message => ({
        role: 'assistant',
        content: JSON.stringify(content.output),
      }),
    );

    messages.push(...historyMessages);
    messages.push({
      role: 'user',
      content: `theme: ${newStory.theme}, with ${newStory.length} words`,
    });
    return messages;
  }

  private buildUserContextInfo(practice: Practice): string {
    const targetLanguage = practice.learnPlan.targetLanguage;
    const nativeLanguage = practice.learnPlan.user.nativeLanguage;
    const contextInfo = `Native language: ${nativeLanguage.name}, target language: ${targetLanguage.name}`;
    this.logger.log(`Built user context info: ${contextInfo}`);
    return contextInfo;
  }
}
