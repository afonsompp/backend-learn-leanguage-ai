import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { GenerateStoryTextController } from '@app/features/story/generator/controller/generate-story-text.controller';
import { GenerateStoryTextService } from '@app/features/story/generator/service/generate-story-text.service';
import { PracticeModule } from '@app/user/practice/practice.module';
import { AIModule } from '@shared/ai/AI.module';

@Module({
  imports: [AuthorizationModule, PracticeModule, AIModule],
  controllers: [GenerateStoryTextController],
  providers: [GenerateStoryTextService],
})
export class StoryModule {}
