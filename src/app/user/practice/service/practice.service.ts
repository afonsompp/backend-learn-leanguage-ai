import {
  ConflictException,
  Injectable,
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
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );
    const practice = await this.practicesRepository.findOne({
      where: { id, learnPlan },
      relations: ['practiceType', 'learnPlan', 'contentHistory'],
    });
    if (!practice) {
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    return practice;
  }

  async findOneById(id: string, userId: string): Promise<Practice> {
    const practice = await this.practicesRepository.findOne({
      where: { id },
      relations: [
        'practiceType',
        'learnPlan',
        'learnPlan.user',
        'contentHistory',
      ],
    });
    if (!practice) {
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
    if (practice.learnPlan.user.userId !== userId) {
      throw new UnauthorizedException(
        'user do not have access to this resource',
      );
    }
    return practice;
  }

  async findAllByLearnPlan(
    learnPlanId: string,
    userId: string,
  ): Promise<Practice[]> {
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );

    const practices = await this.practicesRepository.find({
      where: { learnPlan },
      relations: ['practiceType'],
    });
    if (!practices) {
      throw new NotFoundException(
        `Practice of type with of userId ${userId} and learnPlanId ${learnPlanId} not found`,
      );
    }
    practices.forEach((practice) => (practice.learnPlan = learnPlan));

    return practices;
  }

  async create(
    createPracticeDto: CreatePracticeDto,
    learnPlanId: string,
    userId: string,
  ): Promise<Practice> {
    const { practiceType } = createPracticeDto;

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
      throw new ConflictException(
        'Practice with the provided practiceType and learnPlan already exists',
      );
    }
    const contentHistory = Array.of(new CreatePracticeContentDto(`user`, null));
    const practice = this.practicesRepository.create({
      practiceType: practiceTypeEntity,
      learnPlan: learnPlanEntity,
      contentHistory,
    });

    await this.practicesRepository.save(practice);

    return practice;
  }

  async delete(id: string, learnPlanId: string, userId: string): Promise<void> {
    const learnPlan = await this.userLearnPlanService.findOne(
      learnPlanId,
      userId,
    );
    const result = await this.practicesRepository.delete({ id, learnPlan });
    if (result.affected === 0) {
      throw new NotFoundException(`Practice with id ${id} not found`);
    }
  }
}
