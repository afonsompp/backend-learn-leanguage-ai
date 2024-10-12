import { Injectable, Logger } from '@nestjs/common';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { StoryTextProcessorService } from '@app/features/story/generator/service/story-text-processor.service';
import { WordService } from '@app/user/vocabulary/service/word.service';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { ChatResponse } from '@shared/ai/openai/text/interface/chat-response';

@Injectable()
export class StoryTextGeneratorService {
  private readonly logger = new Logger(StoryTextGeneratorService.name);

  constructor(
    private readonly practiceService: PracticeService,
    private readonly wordService: WordService,
    private readonly storyTextProcessorService: StoryTextProcessorService,
    private readonly openaiTextClientService: OpenaiTextClientService,
  ) {}

  async generate(
    request: GenerateStoryTextDto,
    practice: Practice,
  ): Promise<ChatResponse> {
    this.logger.log(`Generating story text for user`);

    const chatRequest = await this.buildChatRequest(practice, request);

    const response = await this.openaiTextClientService.chat(chatRequest);

    if (!response.choices || response.choices.length === 0) {
      this.logger.error('No response choices from OpenAI');
      throw new Error('No response from OpenAI');
    }
    this.logger.log(`Story generated with success`);

    return response;
  }
  private async buildChatRequest(
    practice: Practice,
    newStory: GenerateStoryTextDto,
  ): Promise<ChatRequest> {
    const chatRequest: ChatRequest = {
      model: practice.practiceType.model,
      messages: await this.generateMessages(practice, newStory),
      temperature: practice.practiceType.temperature,
      top_p: practice.practiceType.topP,
      max_tokens: practice.practiceType.maxTokens,
      stream: practice.practiceType.stream,
      response_format: {
        type: practice.practiceType.responseType,
        json_schema: practice.practiceType.responseSchema,
      },
    };
    this.logger.log(`Built chat request`);
    return chatRequest;
  }

  private async generateMessages(
    practice: Practice,
    newStory: GenerateStoryTextDto,
  ): Promise<Message[]> {
    return [
      {
        role: 'system',
        content: practice.practiceType.instruction,
      },
      {
        role: 'user',
        content: this.buildUserContextInfo(practice),
      },
      {
        role: 'user',
        content: `My actual vocabulary is: ${await this.buildVocabularyString(practice.learnPlan)}`,
      },
      {
        role: 'user',
        content: `create story about: ${newStory.theme}, with ${newStory.length} words`,
      },
    ];
  }

  private buildUserContextInfo(practice: Practice): string {
    const targetLanguage = practice.learnPlan.targetLanguage;
    const nativeLanguage = practice.learnPlan.user.nativeLanguage;
    const contextInfo = `my native language is: ${nativeLanguage.code}, and generate text in language: ${targetLanguage.code}`;
    this.logger.log(`Built user context info: ${contextInfo}`);
    return contextInfo;
  }

  private async buildVocabularyString(
    learnPlan: UserLearnPlan,
  ): Promise<string> {
    const vocabulary = await this.wordService.findUserVocabulary(
      learnPlan.user.userId,
      learnPlan.id,
    );
    return vocabulary.map((word) => `${word.word}: ${word.rating}`).join(', ');
  }
}
