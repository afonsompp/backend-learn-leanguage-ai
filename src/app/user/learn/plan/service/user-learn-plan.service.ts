import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { LanguageService } from '@app/system/language/service/language.service';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

@Injectable()
export class LearnPlanService {
  private readonly logger = new Logger(LearnPlanService.name);

  constructor(
    @InjectRepository(UserLearnPlan)
    private learnPlansRepository: Repository<UserLearnPlan>,
    private readonly languageService: LanguageService,
  ) {}

  async findAll(userId: string): Promise<LearnPlanDto[]> {
    this.logger.log(`Fetching all learn plans for user: ${userId}`);

    const userLearnPlans = await this.learnPlansRepository.find({
      where: { userId },
      relations: ['nativeLanguage', 'targetLanguage'],
    });
    this.logger.log(
      `Found ${userLearnPlans.length} learn plans for user: ${userId}`,
    );
    return userLearnPlans.map(
      (userLearnPlan) => new LearnPlanDto(userLearnPlan),
    );
  }

  async findOne(id: string, userId: string): Promise<UserLearnPlan> {
    this.logger.log(`Fetching learn plan with id: ${id} for user: ${userId}`);
    const learnPlan = await this.learnPlansRepository.findOne({
      where: { id, userId: userId },
      relations: ['nativeLanguage', 'targetLanguage'],
    });
    if (!learnPlan) {
      this.logger.error(`Learn plan with id ${id} not found`);
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }

    this.logger.log(`Found learn plan with id: ${id} for user: ${userId}`);
    return learnPlan;
  }

  async create(
    createLearnPlanDto: CreateLearnPlanDto,
    userId: string,
  ): Promise<LearnPlanDto> {
    const { level } = createLearnPlanDto;
    this.logger.log(`Creating learn plan for user: ${userId}`);

    const targetLanguage = await this.languageService.findOne(
      createLearnPlanDto.targetLanguage,
    );
    const nativeLanguage = await this.languageService.findOne(
      createLearnPlanDto.nativeLanguage,
    );

    await this.existLearnPlanByUserAndTargetLanguageAndLevel(
      userId,
      targetLanguage,
      nativeLanguage,
      level,
    );

    const learnPlan = this.learnPlansRepository.create({
      userId,
      targetLanguage,
      nativeLanguage,
      level,
    });

    await this.learnPlansRepository.save(learnPlan);

    this.logger.log(`Created learn plan for user: ${userId}`);
    return new LearnPlanDto(learnPlan);
  }

  async delete(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting learn plan with id: ${id} for user: ${userId}`);

    const result = await this.learnPlansRepository.delete({ id, userId });
    if (result.affected === 0) {
      this.logger.error(
        `Learn plan with id ${id} not found for user: ${userId}`,
      );
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
    this.logger.log(`Deleted learn plan with id: ${id} for user: ${userId}`);
  }

  private async existLearnPlanByUserAndTargetLanguageAndLevel(
    userId: string,
    targetLanguage: Language,
    nativeLanguage: Language,
    level: LanguageLevel,
  ) {
    if (
      await this.learnPlansRepository.existsBy({
        userId,
        targetLanguage,
        nativeLanguage,
        level,
      })
    ) {
      this.logger.error(
        `Duplicate learn plan with: ${userId} | ${targetLanguage.code} | ${level}`,
      );
      throw new ConflictException(`Duplicate learn plan for user: ${userId}`);
    }
  }
}
