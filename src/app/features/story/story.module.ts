import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { PracticeModule } from '@app/user/practice/practice.module';
import { AIModule } from '@shared/ai/AI.module';
import { VocabularyModule } from '@app/user/vocabulary/vocabulary.module';
import { BlobModule } from '@core/storage/blob/blob.module';
import { StoryTextService } from '@app/features/story/service/story-text.service';
import { StoryService } from '@app/features/story/service/story.service';
import { StoryAudioService } from '@app/features/story/service/story-audio.service';
import { StoryTextProcessorService } from '@app/features/story/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/service/story-text-pre-processor.service';
import { StoryController } from '@app/features/story/controller/story.controller';
import { GenerateAudioListener } from '@app/features/story/listener/generate-audio.listener';

@Module({
  imports: [
    AuthorizationModule,
    PracticeModule,
    AIModule,
    VocabularyModule,
    BlobModule,
  ],
  controllers: [StoryController],
  providers: [
    StoryTextService,
    StoryService,
    StoryAudioService,
    StoryTextProcessorService,
    StoryTextPreProcessorService,
    GenerateAudioListener,
  ],
})
export class StoryModule {}
