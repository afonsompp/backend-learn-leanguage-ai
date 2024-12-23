import { Injectable, Logger } from '@nestjs/common';
import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';
import { WordService } from '@app/user/vocabulary/service/word.service';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { ChatResponse } from '@shared/ai/openai/text/interface/chat-response';
import { StoryTextProcessorService } from '@app/features/story/service/story-text-processor.service';
import { GenerateStoryTextDto } from '@app/features/story/dto/generate-story-text.dto';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';

@Injectable()
export class StoryTextService {
  private readonly logger = new Logger(StoryTextService.name);

  constructor(
    private readonly wordService: WordService,
    private readonly storyTextProcessorService: StoryTextProcessorService,
    private readonly openaiTextClientService: OpenaiTextClientService,
  ) {}

  async generate(
    request: GenerateStoryTextDto,
    learnPlan: UserLearnPlan,
    practiceType: PracticeType,
  ): Promise<ChatResponse> {
    this.logger.log(`Generating story text for user`);

    const chatRequest = await this.buildChatRequest(
      learnPlan,
      practiceType,
      request,
    );

    const response = await this.openaiTextClientService.chat(chatRequest);

    if (!response.choices || response.choices.length === 0) {
      this.logger.error('No response choices from OpenAI');
      throw new Error('No response from OpenAI');
    }
    this.logger.log(`Story generated with success`);

    return response;
  }
  private async buildChatRequest(
    learnPlan: UserLearnPlan,
    practiceType: PracticeType,
    newStory: GenerateStoryTextDto,
  ): Promise<ChatRequest> {
    const chatRequest: ChatRequest = {
      model: practiceType.model,
      messages: await this.generateMessages(practiceType, learnPlan, newStory),
      temperature: practiceType.temperature,
      top_p: practiceType.topP,
      max_tokens: practiceType.maxTokens,
      stream: practiceType.stream,
      response_format: {
        type: practiceType.responseType,
        json_schema: practiceType.responseSchema,
      },
    };
    this.logger.log(`Built chat request`);
    return chatRequest;
  }

  private async generateMessages(
    practiceType: PracticeType,
    learnPlan: UserLearnPlan,
    newStory: GenerateStoryTextDto,
  ): Promise<Message[]> {
    return [
      {
        role: 'system',
        content: practiceType.instruction,
      },
      {
        role: 'user',
        content: this.buildUserContextInfo(learnPlan),
      },
      {
        role: 'user',
        content: `My actual vocabulary is: ${await this.buildVocabularyString(learnPlan)}`,
      },
      {
        role: 'user',
        content: `create story about: ${newStory.theme}, with ${newStory.length} words`,
      },
    ];
  }

  private buildUserContextInfo(learnPlan: UserLearnPlan): string {
    const targetLanguage = learnPlan.targetLanguage;
    const nativeLanguage = learnPlan.nativeLanguage;
    const contextInfo = `my native language is: ${nativeLanguage.code}, and generate text in language: ${targetLanguage.code}`;
    this.logger.log(`Built user context info: ${contextInfo}`);
    return contextInfo;
  }

  private async buildVocabularyString(
    learnPlan: UserLearnPlan,
  ): Promise<string> {
    const vocabulary = await this.wordService.findUserVocabulary(
      learnPlan.userId,
      learnPlan.id,
    );
    return vocabulary.map((word) => `${word.word}: ${word.rating}`).join(', ');
  }
}
