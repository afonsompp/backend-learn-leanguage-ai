import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';
import { BlobService } from '@core/storage/blob/service/blob.service';
import { StoryTextService } from '@app/features/story/service/story-text.service';
import { StoryTextProcessorService } from '@app/features/story/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/service/story-text-pre-processor.service';
import { StoryAudioService } from '@app/features/story/service/story-audio.service';
import { GenerateStoryTextDto } from '@app/features/story/dto/generate-story-text.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly practiceService: PracticeService,
    private readonly generateTextService: StoryTextService,
    private readonly storyTextProcessorService: StoryTextProcessorService,
    private readonly storyTextPreProcessorService: StoryTextPreProcessorService,
    private readonly storyAudioService: StoryAudioService,
    private readonly blobService: BlobService,
    private eventEmitter: EventEmitter2,
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

    this.eventEmitter.emit('story.created', {
      storyId: practiceContent.id,
      userId,
    });

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

  async getStoryAudio(storyId, userId: string) {
    const practiceContent = await this.practiceContentService.findOne(
      storyId,
      userId,
    );

    const objectExists = await this.blobService.objectExists(
      this.storyAudioService.getAudioKey(practiceContent),
    );

    if (!objectExists) {
      throw new NotFoundException('Audio not found, try again later');
    }

    const url = await this.blobService.getFileUrl({
      key: this.storyAudioService.getAudioKey(practiceContent),
      urlExpiresIn: 600,
    });

    return { url };
  }
}
