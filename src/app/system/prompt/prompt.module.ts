import { Module } from '@nestjs/common';
import { PromptTemplateController } from './controller/prompt-template.controller';
import { PromptTemplateService } from './service/prompt-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptTemplate } from '@app/system/prompt/entities/prompt-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PromptTemplate])],
  controllers: [PromptTemplateController],
  providers: [PromptTemplateService],
  exports: [PromptTemplateService],
})
export class PromptModule {}
