import { Injectable, Logger } from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { StoryTextGeneratorService } from '@app/features/story/generator/service/story-text-generator.service';
import { StoryTextProcessorService } from '@app/features/story/generator/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/generator/service/story-text-pre-processor.service';

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

    const storyText = JSON.parse(generatedStory);

    const preProcessedText = this.storyTextPreProcessorService.processText(
      storyText.story.content,
    );

    return this.storyTextProcessorService.processStoryText(
      preProcessedText,
      practice,
    );
  }
}
