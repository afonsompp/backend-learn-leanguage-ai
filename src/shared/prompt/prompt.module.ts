import { Module } from '@nestjs/common';
import { PromptFactoryService } from './prompt-factory.service';

@Module({
  providers: [PromptFactoryService],
  exports: [PromptFactoryService],
})
export class PromptModule {}
