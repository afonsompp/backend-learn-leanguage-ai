import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { PracticeContentDto } from '@app/user/practice/dto/content/practice-content.dto';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';
import { PracticeService } from '@app/user/practice/service/practice.service';

@Injectable()
export class PracticeContentService {
  private readonly logger = new Logger(PracticeContentService.name);

  constructor(
    @InjectRepository(PracticeContent)
    private practiceContentRepository: Repository<PracticeContent>,
    private readonly practiceService: PracticeService,
  ) {}

  async create(
    createPracticeContentDto: CreatePracticeContentDto,
    userId: string,
  ): Promise<PracticeContentDto> {
    const practice = await this.practiceService.findOneById(
      createPracticeContentDto.practiceId,
      userId,
    );

    if (practice.learnPlan.user.userId !== userId) {
      this.logger.error(
        `User ${userId} tried to access practice ${createPracticeContentDto.practiceId} without permission`,
      );
      throw new ForbiddenException(
        'You do not have permission to access this practice',
      );
    }
    this.logger.log(`Creating practice content`);
    const practiceContent = this.practiceContentRepository.create({
      ...createPracticeContentDto,
      practice,
    });

    await this.practiceContentRepository.save(practiceContent);
    this.logger.log(`Created practice content with id: ${practiceContent.id}`);
    return new PracticeContentDto(practiceContent);
  }

  async findAllByPracticeId(
    practiceId: string,
    userId: string,
  ): Promise<PracticeContent[]> {
    this.logger.log(
      `Fetching practice contents for practiceId ${practiceId} and user ${userId}`,
    );
    const practice = await this.practiceService.findOneById(practiceId, userId);

    if (practice.learnPlan.user.userId !== userId) {
      this.logger.error(
        `User ${userId} tried to access practice ${practiceId} without permission`,
      );
      throw new ForbiddenException(
        'You do not have permission to access this practice',
      );
    }

    return this.practiceContentRepository.find({
      where: { practice },
    });
  }

  async findOne(
    id: string,
    practiceId: string,
    userId: string,
  ): Promise<PracticeContent> {
    this.logger.log(`Fetching practice content with id: ${id}`);
    const practice = await this.practiceService.findOneById(practiceId, userId);

    const practiceContent = await this.practiceContentRepository.findOne({
      where: { id, practice },
      relations: ['practice'],
    });
    if (!practiceContent) {
      this.logger.error(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }

    if (practiceContent.practice.learnPlan.user.userId !== userId) {
      this.logger.error(
        `User ${userId} tried to access practice content ${id} without permission`,
      );
      throw new ForbiddenException(
        'You do not have permission to access this practice content',
      );
    }

    this.logger.log(`Found practice content with id: ${id}`);
    return practiceContent;
  }

  async remove(id: string, practiceId: string, userId: string): Promise<void> {
    this.logger.log(`Deleting practice content with id: ${id}`);
    await this.findOne(id, practiceId, userId);
    const result = await this.practiceContentRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
    this.logger.log(`Deleted practice content with id: ${id}`);
  }
}
