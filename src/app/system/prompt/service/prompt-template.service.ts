import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromptDto } from '../dto/create-prompt.dto';
import { PromptDto } from '../dto/prompt.dto';
import { UpdatePromptDto } from '../dto/update-prompt.dto';
import { PromptTemplate } from '@app/system/prompt/entities/prompt-template.entity';

@Injectable()
export class PromptTemplateService {
  constructor(
    @InjectRepository(PromptTemplate)
    private promptTemplateRepository: Repository<PromptTemplate>,
  ) {}

  async findAll(): Promise<PromptDto[]> {
    const languages = await this.promptTemplateRepository.find();
    return languages.map((language) => new PromptDto(language));
  }

  async findOne(name: string): Promise<PromptTemplate> {
    const promptTemplate = await this.promptTemplateRepository.findOne({
      where: { name },
    });
    if (!promptTemplate) {
      throw new NotFoundException(`Prompt with name ${name} not found`);
    }
    return promptTemplate;
  }

  async create(createLanguageDto: CreatePromptDto): Promise<PromptDto> {
    if (
      await this.promptTemplateRepository.existsBy({
        name: createLanguageDto.name,
      })
    ) {
      throw new ConflictException(
        `Language with code ${createLanguageDto.name} already exists`,
      );
    }
    const createdLanguage =
      this.promptTemplateRepository.create(createLanguageDto);
    await this.promptTemplateRepository.save(createdLanguage);
    return new PromptDto(createdLanguage);
  }

  async update(
    id: string,
    updateLanguageDto: UpdatePromptDto,
  ): Promise<PromptDto> {
    const result = await this.promptTemplateRepository.update(
      { id },
      updateLanguageDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    const updatedLanguage = await this.promptTemplateRepository.findOne({
      where: { id },
    });
    return new PromptDto(updatedLanguage);
  }

  async delete(id: string): Promise<void> {
    const result = await this.promptTemplateRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Language with code ${id} not found`);
    }
  }
}
