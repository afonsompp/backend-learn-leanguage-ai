import { Module } from '@nestjs/common';
import { StoryTextModule } from '@app/features/story/text/story-text.module';

@Module({
  imports: [StoryTextModule],
})
export class StoryModule {}
