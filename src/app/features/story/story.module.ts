import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { GenerateStoryTextController } from '@app/features/story/generator/controller/generate-story-text.controller';
import { StoryTextGeneratorService } from '@app/features/story/generator/service/story-text-generator.service';
import { PracticeModule } from '@app/user/practice/practice.module';
import { AIModule } from '@shared/ai/AI.module';
import { VocabularyModule } from '@app/user/vocabulary/vocabulary.module';
import { StoryTextService } from '@app/features/story/generator/service/story-text.service';
import { StoryTextProcessorService } from '@app/features/story/generator/service/story-text-processor.service';
import { StoryTextPreProcessorService } from '@app/features/story/generator/service/story-text-pre-processor.service';

@Module({
  imports: [AuthorizationModule, PracticeModule, AIModule, VocabularyModule],
  controllers: [GenerateStoryTextController],
  providers: [
    StoryTextGeneratorService,
    StoryTextService,
    StoryTextProcessorService,
    StoryTextPreProcessorService,
  ],
})
export class StoryModule {}
