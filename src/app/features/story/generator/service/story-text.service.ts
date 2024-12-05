import { Injectable, Logger } from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { StoryTextGeneratorService } from '@app/features/story/generator/service/story-text-generator.service';
import { StoryTextProcessorService } from '@app/features/story/generator/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/generator/service/story-text-pre-processor.service';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';

@Injectable()
export class StoryTextService {
  private readonly logger = new Logger(StoryTextService.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly practiceService: PracticeService,
    private readonly generateTextService: StoryTextGeneratorService,
    private readonly storyTextProcessorService: StoryTextProcessorService,
    private readonly storyTextPreProcessorService: StoryTextPreProcessorService,
  ) {}

  async createStory(request: GenerateStoryTextDto, userId: string) {
    const practice = await this.practiceService.findOneById(
      request.practiceId,
      userId,
    );

    const generatedStory = await this.generateTextService.generate(
      request,
      practice,
    );

    const storyText = JSON.parse(generatedStory.choices[0].message.content);

    const createPracticeContent: CreatePracticeContentDto = {
      input: request.theme,
      output: storyText,
      practiceId: request.practiceId,
      totalTokens: generatedStory.usage.total_tokens,
    };

    const practiceContent = await this.practiceContentService.create(
      createPracticeContent,
      userId,
    );

    const preProcessedText = this.storyTextPreProcessorService.processText(
      storyText.story.content,
    );

    const processedText = await this.storyTextProcessorService.processStoryText(
      preProcessedText,
      practice,
    );

    return {
      id: practiceContent.id,
      story: processedText,
    };
  }

  async getStory(storyId: string, userId: string) {
    const practiceContent = await this.practiceContentService.findOne(
      storyId,
      userId,
    );

    const preProcessedText = this.storyTextPreProcessorService.processText(
      practiceContent.output.story.content,
    );

    const processedText = await this.storyTextProcessorService.processStoryText(
      preProcessedText,
      practiceContent.practice,
    );

    return {
      id: practiceContent.id,
      story: processedText,
    };
  }
}
