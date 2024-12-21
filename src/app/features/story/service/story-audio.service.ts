import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { OpenaiTextToSpeechService } from '@shared/ai/openai/audio/speech/service/openai-text-to-speech.service';
import { BlobService } from '@core/storage/blob/service/blob.service';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { Readable } from 'stream';

@Injectable()
export class StoryAudioService {
  private readonly logger = new Logger(StoryAudioService.name);

  constructor(
    private readonly practiceContentService: PracticeContentService,
    private readonly text2SpeechService: OpenaiTextToSpeechService,
    private readonly blobService: BlobService,
  ) {}

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

  async getStoryAudio(practiceContent: PracticeContent) {
    const objectExists = await this.blobService.objectExists(
      this.getAudioKey(practiceContent),
    );

    if (!objectExists) {
      throw new NotFoundException('Audio cannot be found');
    }

    const url = await this.blobService.getFileUrl({
      key: this.getAudioKey(practiceContent),
      urlExpiresIn: 600,
    });

    return { url };
  }

  async deleteStoryAudio(practiceContent: PracticeContent) {
    this.blobService
      .deleteObject(this.getAudioKey(practiceContent))
      .then(() => {
        this.logger.log('object deleted with success');
      })
      .catch(() => {
        this.logger.log('Error during object exclusion');
      });
  }

  private getAudioKey(practiceContent: PracticeContent): string {
    const user = practiceContent.practice.learnPlan.user.userId;
    const learnPlan = practiceContent.practice.learnPlan.id;
    const practice = practiceContent.practice.id;
    return `user/${user}/learn-plan/${learnPlan}/practice/${practice}/practice-content/${practiceContent.id}.mp3`;
  }
}
