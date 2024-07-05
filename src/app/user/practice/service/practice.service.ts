import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnPlansService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { CreatePracticeDto } from '@app/user/practice/dto/pratice/create-practice.dto';
import { CreatePracticeContentDto } from '@app/user/practice/dto/content/create-practice-content.dto';

@Injectable()
export class PracticeService {
  private readonly logger = new Logger(PracticeService.name);

  constructor(
    @InjectRepository(Practice)
    private practicesRepository: Repository<Practice>,
    private readonly practiceTypeService: PracticeTypeService,
    private readonly userLearnPlanService: LearnPlansService,
  ) {}

  async findOneByIdAndLearnPlan(
    id: string,
    learnPlanId: string,
    userId: string,
  ): Promise<Practice> {
    this.logger.log(
      `Fetching practice with id: ${id} and learnPlanId: ${learnPlanId} for user: ${userId}`,
    );
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );
    const practice = await this.practicesRepository.findOne({
      where: { id, learnPlan },
      relations: ['practiceType', 'learnPlan', 'contentHistory'],
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
      where: { id },
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
    if (practice.learnPlan.user.userId !== userId) {
      this.logger.warn(
        `User ${userId} is not authorized to access practice with id ${id}`,
      );
      throw new UnauthorizedException(
        'User does not have access to this resource',
      );
    }
    this.logger.log(`Found practice with id: ${id} for user: ${userId}`);
    return practice;
  }

  async findAllByLearnPlan(
    learnPlanId: string,
    userId: string,
  ): Promise<Practice[]> {
    this.logger.log(
      `Fetching all practices for learnPlanId: ${learnPlanId} and user: ${userId}`,
    );
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );

    const practices = await this.practicesRepository.find({
      where: { learnPlan },
      relations: ['practiceType'],
    });
    if (!practices || practices.length === 0) {
      this.logger.error(
        `Practices not found for userId: ${userId} and learnPlanId: ${learnPlanId}`,
      );
      throw new NotFoundException(
        `Practices not found for userId ${userId} and learnPlanId ${learnPlanId}`,
      );
    }
    practices.forEach((practice) => (practice.learnPlan = learnPlan));

    this.logger.log(
      `Found ${practices.length} practices for learnPlanId: ${learnPlanId} and user: ${userId}`,
    );
    return practices;
  }

  async create(
    createPracticeDto: CreatePracticeDto,
    learnPlanId: string,
    userId: string,
  ): Promise<Practice> {
    const { practiceType } = createPracticeDto;
    this.logger.log(
      `Creating practice for learnPlanId: ${learnPlanId}, user: ${userId}, practiceType: ${practiceType}`,
    );

    const practiceTypeEntity =
      await this.practiceTypeService.findOne(practiceType);
    const learnPlanEntity = await this.userLearnPlanService.findOne(
      learnPlanId,
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
        `Practice with practiceType ${practiceType} and learnPlanId ${learnPlanId} already exists`,
      );
      throw new ConflictException(
        'Practice with the provided practiceType and learnPlan already exists',
      );
    }

    const contentHistory = Array.of(new CreatePracticeContentDto('user', null));
    const practice = this.practicesRepository.create({
      practiceType: practiceTypeEntity,
      learnPlan: learnPlanEntity,
      contentHistory,
    });

    await this.practicesRepository.save(practice);
    this.logger.log(
      `Created practice for learnPlanId: ${learnPlanId}, user: ${userId}, practiceType: ${practiceType}`,
    );
    return practice;
  }

  async delete(id: string, learnPlanId: string, userId: string): Promise<void> {
    this.logger.log(
      `Deleting practice with id: ${id}, learnPlanId: ${learnPlanId}, userId: ${userId}`,
    );
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );
    const result = await this.practicesRepository.delete({ id, learnPlan });
    if (result.affected === 0) {
      this.logger.error(`Practice with id ${id} not found`);
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    this.logger.log(`Deleted practice with id: ${id}`);
  }
}
