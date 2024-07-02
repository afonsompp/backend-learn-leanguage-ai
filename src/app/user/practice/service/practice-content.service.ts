import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { PracticeContentDto } from '@app/user/practice/dto/content/practice-content.dto';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';

@Injectable()
export class PracticeContentService {
  constructor(
    @InjectRepository(PracticeContent)
    private practiceContentRepository: Repository<PracticeContent>,
  ) {}

  async create(
    createPracticeContentDto: CreatePracticeContentDto,
  ): Promise<PracticeContentDto> {
    const practiceContent = this.practiceContentRepository.create(
      createPracticeContentDto,
    );
    await this.practiceContentRepository.save(practiceContent);
    return new PracticeContentDto(practiceContent);
  }

  async findAll(): Promise<PracticeContent[]> {
    return this.practiceContentRepository.find({ relations: ['practice'] });
  }

  async findOne(id: string): Promise<PracticeContent> {
    const practiceContent = await this.practiceContentRepository.findOne({
      where: { id },
      relations: ['practice'],
    });
    if (!practiceContent) {
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
    return practiceContent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.practiceContentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
  }
}
