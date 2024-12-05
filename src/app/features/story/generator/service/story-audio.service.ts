import { Injectable, Logger } from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { StoryTextService } from '@app/features/story/generator/service/story-text.service';
import { OpenaiTextToSpeechService } from '@shared/ai/openai/audio/speech/service/openai-text-to-speech.service';
import { BlobService } from '@core/storage/blob/service/blob.service';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { Readable } from 'stream';

@Injectable()
export class StoryAudioService {
  private readonly logger = new Logger(StoryTextService.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly text2SpeechService: OpenaiTextToSpeechService,
    private readonly blobService: BlobService,
  ) {}

  async getStoryAudio(storyId, userId: string) {
    const practiceContent = await this.practiceContentService.findOne(
      storyId,
      userId,
    );

    const objectExists = await this.blobService.objectExists(
      this.getAudioKey(practiceContent),
    );

    if (!objectExists) {
      this.generateAudio(practiceContent).then(() => {
        this.logger.log('audio generated and uploaded with success');
      });
    }

    const url = await this.blobService.getFileUrl({
      key: this.getAudioKey(practiceContent),
      urlExpiresIn: 600,
    });

    return { url };
  }

  getAudioKey(practiceContent: PracticeContent): string {
    const user = practiceContent.practice.learnPlan.user.userId;
    const learnPlan = practiceContent.practice.learnPlan.id;
    const practice = practiceContent.practice.id;
    return `user/${user}/learn-plan/${learnPlan}/practice/${practice}/practice-content/${practiceContent.id}.mp3`;
  }

  async generateAudio(practiceContent: PracticeContent) {
    this.text2SpeechService
      .speech({
        model: 'tts-1',
        input: practiceContent.output.story.content,
        voice: 'alloy',
      })
      .then((result: Readable) => {
        this.blobService.uploadObject({
          key: this.getAudioKey(practiceContent),
          body: result,
        });
      });
  }
}
