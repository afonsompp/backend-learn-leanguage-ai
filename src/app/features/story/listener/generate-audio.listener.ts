import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GenerateAudioEvent } from '@app/features/story/event/generate-audio.event';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { StoryAudioService } from '@app/features/story/service/story-audio.service';
import { BlobService } from '@core/storage/blob/service/blob.service';

@Injectable()
export class GenerateAudioListener {
  private readonly logger = new Logger(GenerateAudioListener.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly storyAudioService: StoryAudioService,
    private readonly blobService: BlobService,
  ) {}

  @OnEvent('story.created')
  async handleOrderCreatedEvent(event: GenerateAudioEvent) {
    const practiceContent = await this.practiceContentService.findOne(
      event.storyId,
      event.userId,
    );

    this.storyAudioService
      .generateAudio(practiceContent)
      .then(async () => {
        await this.practiceContentService.update(
          { audioEventStatus: 'COMPLETED' },
          event.storyId,
          event.userId,
        );
        this.logger.log('Story audio created with success');
      })
      .catch(async () => {
        await this.practiceContentService.update(
          { audioEventStatus: 'ERROR' },
          event.storyId,
          event.userId,
        );
        this.logger.log('Error during audio creation');
      });
  }
}
