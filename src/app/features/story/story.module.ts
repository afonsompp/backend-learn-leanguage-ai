import { Module } from '@nestjs/common';
import { StoryTextModule } from '@app/features/story/text/story-text.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    StoryTextModule,
    RouterModule.register([
      {
        path: 'story',
        module: StoryTextModule,
      },
    ]),
  ],
})
export class StoryModule {}
