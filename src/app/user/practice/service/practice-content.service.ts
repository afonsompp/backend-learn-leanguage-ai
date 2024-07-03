import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { PracticeContentDto } from '@app/user/practice/dto/content/practice-content.dto';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';

@Injectable()
export class PracticeContentService {
  private readonly logger = new Logger(PracticeContentService.name);

  constructor(
    @InjectRepository(PracticeContent)
    private practiceContentRepository: Repository<PracticeContent>,
  ) {}

  async create(
    createPracticeContentDto: CreatePracticeContentDto,
  ): Promise<PracticeContentDto> {
    this.logger.log(`Creating practice content`);
    const practiceContent = this.practiceContentRepository.create(
      createPracticeContentDto,
    );
    await this.practiceContentRepository.save(practiceContent);
    this.logger.log(`Created practice content with id: ${practiceContent.id}`);
    return new PracticeContentDto(practiceContent);
  }

  async findAll(): Promise<PracticeContent[]> {
    this.logger.log(`Fetching all practice contents`);
    return this.practiceContentRepository.find({ relations: ['practice'] });
  }

  async findOne(id: string): Promise<PracticeContent> {
    this.logger.log(`Fetching practice content with id: ${id}`);
    const practiceContent = await this.practiceContentRepository.findOne({
      where: { id },
      relations: ['practice'],
    });
    if (!practiceContent) {
      this.logger.warn(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
    this.logger.log(`Found practice content with id: ${id}`);
    return practiceContent;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting practice content with id: ${id}`);
    const result = await this.practiceContentRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
    this.logger.log(`Deleted practice content with id: ${id}`);
  }
}
