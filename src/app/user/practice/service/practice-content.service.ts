import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { CreatePracticeContentDto } from '@app/user/practice/dto/create-practice-content.dto';
import { PracticeContentDto } from '@app/user/practice/dto/practice-content.dto';
import { UpdatePracticeContentDto } from '@app/user/practice/dto/update-practice-content.dto';

@Injectable()
export class PracticeContentService {
  private readonly logger = new Logger(PracticeContentService.name);

  constructor(
    @InjectRepository(PracticeContent)
    private practiceContentRepository: Repository<PracticeContent>,
    private readonly userLearnPlanService: LearnPlanService,
  ) {}

  async create(
    createPracticeContentDto: CreatePracticeContentDto,
    userId: string,
  ): Promise<PracticeContentDto> {
    const learnPlan = await this.userLearnPlanService.findOne(
      createPracticeContentDto.learnPlanId,
      userId,
    );

    this.logger.log(`Creating practice content`);
    const practiceContent = this.practiceContentRepository.create({
      ...createPracticeContentDto,
      learnPlan,
    });

    await this.practiceContentRepository.save(practiceContent);
    this.logger.log(`Created practice content with id: ${practiceContent.id}`);
    return new PracticeContentDto(practiceContent);
  }

  async update(
    updatePracticeContentDto: UpdatePracticeContentDto,
    practiceContentId: string,
    userId: string,
  ): Promise<PracticeContentDto> {
    const practiceContent = await this.findOne(practiceContentId, userId);

    this.logger.log(`Update practice content`);

    practiceContent.audioEventStatus =
      updatePracticeContentDto.audioEventStatus;

    await this.practiceContentRepository.update(
      { id: practiceContentId },
      practiceContent,
    );

    this.logger.log(`practice content with id: ${practiceContent.id} updated`);
    return new PracticeContentDto(practiceContent);
  }

  async findOne(id: string, userId: string): Promise<PracticeContent> {
    this.logger.log(`Fetching practice content with id: ${id}`);
    const practiceContent = await this.practiceContentRepository.findOne({
      where: {
        id,
        learnPlan: {
          userId,
        },
      },
      relations: ['learnPlan'],
    });
    if (!practiceContent) {
      this.logger.error(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }

    if (practiceContent.learnPlan.userId !== userId) {
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

  async remove(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting practice content with id: ${id}`);
    await this.findOne(id, userId);
    const result = await this.practiceContentRepository.delete(id);
    if (result.affected === 0) {
      this.logger.error(`PracticeContent with id ${id} not found`);
      throw new NotFoundException(`PracticeContent with id ${id} not found`);
    }
    this.logger.log(`Deleted practice content with id: ${id}`);
  }
}
