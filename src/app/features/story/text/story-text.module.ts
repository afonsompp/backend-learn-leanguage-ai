import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { GenerateStoryTextController } from '@app/features/story/text/generator/controller/generate-story-text.controller';
import { GenerateStoryTextService } from '@app/features/story/text/generator/service/generate-story-text.service';

@Module({
  imports: [AuthorizationModule],
  controllers: [GenerateStoryTextController],
  providers: [GenerateStoryTextService],
})
export class StoryTextModule {}
