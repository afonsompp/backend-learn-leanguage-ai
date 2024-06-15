import { Module } from '@nestjs/common';
import { PromptFactory } from './factory/prompt-factory.service';

@Module({
  providers: [PromptFactory],
  exports: [PromptFactory],
})
export class PromptModule {}
