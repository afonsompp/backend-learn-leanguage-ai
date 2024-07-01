import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PromptTemplateService } from '../service/prompt-template.service';
import { PromptDto } from '../dto/prompt.dto';
import { UpdatePromptDto } from '../dto/update-prompt.dto';
import { CreatePromptDto } from '../dto/create-prompt.dto';

@Controller('prompts')
export class PromptTemplateController {
  constructor(private readonly promptTemplateService: PromptTemplateService) {}

  @Get()
  findAll(): Promise<PromptDto[]> {
    return this.promptTemplateService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string): Promise<PromptDto> {
    return new PromptDto(await this.promptTemplateService.findOne(name));
  }

  @Post()
  create(@Body() prompt: CreatePromptDto): Promise<PromptDto> {
    return this.promptTemplateService.create(prompt);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() prompt: UpdatePromptDto,
  ): Promise<PromptDto> {
    return this.promptTemplateService.update(id, prompt);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): Promise<void> {
    return this.promptTemplateService.delete(id);
  }
}
