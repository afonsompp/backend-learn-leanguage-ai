import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { CreatePracticeDto } from '@app/user/practice/dto/pratice/create-practice.dto';

@Injectable()
export class PracticeService {
  private readonly logger = new Logger(PracticeService.name);

  constructor(
    @InjectRepository(Practice)
    private practicesRepository: Repository<Practice>,
    private readonly practiceTypeService: PracticeTypeService,
    private readonly userLearnPlanService: LearnPlanService,
  ) {}

  async findOneByIdAndLearnPlan(id: string, userId: string): Promise<Practice> {
    this.logger.log(`Fetching practice with id: ${id} for user: ${userId}`);
    const practice = await this.practicesRepository.findOne({
      where: {
        id,
        learnPlan: {
          user: { userId },
        },
      },
      relations: [
        'practiceType',
        'learnPlan.user',
        'learnPlan.targetLanguage',
        'learnPlan.user.nativeLanguage',
      ],
    });
    if (!practice) {
      this.logger.warn(`Practice with id ${id} not found`);
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    this.logger.log(`Found practice with id: ${id} for user: ${userId}`);
    return practice;
  }

  async findOneById(id: string, userId: string): Promise<Practice> {
    this.logger.log(`Fetching practice with id: ${id} for user: ${userId}`);
    const practice = await this.practicesRepository.findOne({
      where: {
        id,
        learnPlan: {
          user: { userId },
        },
      },
      relations: [
        'practiceType',
        'learnPlan.targetLanguage',
        'learnPlan.user',
        'learnPlan.user.nativeLanguage',
        'contentHistory',
      ],
    });
    if (!practice) {
      this.logger.warn(`Practice with id ${id} not found`);
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    this.logger.log(`Found practice with id: ${id} for user: ${userId}`);
    return practice;
  }

  async findAllByUser(userId: string): Promise<Practice[]> {
    this.logger.log(`Fetching all practices for user: ${userId}`);
    const practices = await this.practicesRepository.find({
      where: {
        learnPlan: {
          user: { userId },
        },
      },
      relations: ['practiceType', 'learnPlan.targetLanguage', 'learnPlan.user'],
    });
    if (!practices || practices.length === 0) {
      this.logger.error(`Practices not found for userId: ${userId}`);
      throw new NotFoundException(`Practices not found for userId ${userId}`);
    }
    this.logger.log(`Found ${practices.length} practices for user: ${userId}`);
    return practices;
  }

  async create(
    createPracticeDto: CreatePracticeDto,
    userId: string,
  ): Promise<Practice> {
    const { practiceType, learnPlan } = createPracticeDto;
    this.logger.log(
      `Creating practice for learnPlanId: ${learnPlan}, user: ${userId}, practiceType: ${practiceType}`,
    );

    const practiceTypeEntity =
      await this.practiceTypeService.findOne(practiceType);
    const learnPlanEntity = await this.userLearnPlanService.findOne(
      learnPlan,
      userId,
    );

    const existingPractice = await this.practicesRepository.findOne({
      where: {
        practiceType: practiceTypeEntity,
        learnPlan: learnPlanEntity,
      },
    });

    if (existingPractice) {
      this.logger.error(
        `Practice with practiceType ${practiceType} and learnPlanId ${learnPlan} already exists`,
      );
      throw new ConflictException(
        'Practice with the provided practiceType and learnPlan already exists',
      );
    }

    const practice = this.practicesRepository.create({
      practiceType: practiceTypeEntity,
      learnPlan: learnPlanEntity,
    });

    await this.practicesRepository.save(practice);
    this.logger.log(
      `Created practice for learnPlanId: ${learnPlan}, user: ${userId}, practiceType: ${practiceType}`,
    );
    return practice;
  }

  async delete(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting practice with id: ${id}, userId: ${userId}`);
    const result = await this.practicesRepository.delete({
      id,
      learnPlan: {
        user: { userId },
      },
    });
    if (result.affected === 0) {
      this.logger.error(`Practice with id ${id} not found`);
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    this.logger.log(`Deleted practice with id: ${id}`);
  }
}
