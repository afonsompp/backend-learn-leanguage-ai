import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { StoryTextService } from '@app/features/story/service/story-text.service';
import { StoryTextProcessorService } from '@app/features/story/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/service/story-text-pre-processor.service';
import { StoryAudioService } from '@app/features/story/service/story-audio.service';
import { GenerateStoryTextDto } from '@app/features/story/dto/generate-story-text.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { CreatePracticeContentDto } from '@app/user/practice/dto/create-practice-content.dto';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly practiceTypeService: PracticeTypeService,
    private readonly userLearnPlanService: LearnPlanService,
    private readonly generateTextService: StoryTextService,
    private readonly storyTextProcessorService: StoryTextProcessorService,
    private readonly storyTextPreProcessorService: StoryTextPreProcessorService,
    private readonly storyAudioService: StoryAudioService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createStory(request: GenerateStoryTextDto, userId: string) {
    const learnPlan = await this.userLearnPlanService.findOne(
      request.learnPlanId,
      userId,
    );

    const practiceType = await this.practiceTypeService.findOne({
      name: 'story',
    });

    const generatedStory = await this.generateTextService.generate(
      request,
      learnPlan,
      practiceType,
    );

    const storyText = JSON.parse(generatedStory.choices[0].message.content);

    const createPracticeContent: CreatePracticeContentDto = {
      input: request.theme,
      output: storyText,
      learnPlanId: request.learnPlanId,
      totalTokens: generatedStory.usage.total_tokens,
    };

    const practiceContent = await this.practiceContentService.create(
      createPracticeContent,
      userId,
    );

    this.eventEmitter.emit('story.created', {
      storyId: practiceContent.id,
      userId,
    });

    const preProcessedText = this.storyTextPreProcessorService.processText(
      storyText.story.content,
    );

    const processedText = await this.storyTextProcessorService.processStoryText(
      preProcessedText,
      learnPlan,
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
      practiceContent.learnPlan,
    );

    return {
      id: practiceContent.id,
      story: processedText,
    };
  }

  async getStoryAudio(
    storyId: string,
    userId: string,
  ): Promise<{ url: string }> {
    const practiceContent = await this.practiceContentService.findOne(
      storyId,
      userId,
    );

    return this.handleAudioEventStatus(practiceContent);
  }

  async deleteStory(storyId: string, userId: string) {
    const practiceContent = await this.practiceContentService.findOne(
      storyId,
      userId,
    );

    await this.storyAudioService.deleteStoryAudio(practiceContent);

    this.practiceContentService.remove(storyId, userId).then(() => {
      this.logger.log('practice content was successful removed');
    });
  }

  private async handleAudioEventStatus(
    practiceContent: PracticeContent,
  ): Promise<{ url: string }> {
    switch (practiceContent.audioEventStatus) {
      case 'COMPLETED':
        try {
          return this.storyAudioService.getStoryAudio(practiceContent);
        } catch (e) {
          await this.handleBlobServiceError(e);
          break;
        }

      case 'IN_PROGRESS':
        throw new NotFoundException(
          'Audio still in processing, try again later',
        );

      case 'ERROR':
        throw new UnprocessableEntityException('Error in audio processing');

      default:
        throw new InternalServerErrorException('Unknown state to audio event');
    }
  }

  private handleBlobServiceError(error: unknown): never {
    if (error instanceof NotFoundException) {
      throw new InternalServerErrorException(
        'Unknown error during audio retrieving',
      );
    }
    throw error;
  }
}
