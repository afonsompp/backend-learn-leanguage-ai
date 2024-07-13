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
import { UserProfileService } from '@app/user/profile/service/user-profile.service';
import { LanguageService } from '@app/system/language/service/language.service';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

@Injectable()
export class LearnPlanService {
  private readonly logger = new Logger(LearnPlanService.name);

  constructor(
    @InjectRepository(UserLearnPlan)
    private learnPlansRepository: Repository<UserLearnPlan>,
    private readonly userProfileService: UserProfileService,
    private readonly languageService: LanguageService,
  ) {}

  async findAll(userId: string): Promise<LearnPlanDto[]> {
    this.logger.log(`Fetching all learn plans for user: ${userId}`);

    const userLearnPlans = await this.learnPlansRepository.find({
      where: { user: { userId } },
      relations: ['user', 'targetLanguage'],
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
      where: { id, user: { userId } },
      relations: ['user', 'targetLanguage'],
    });
    if (!learnPlan) {
      this.logger.error(`Learn plan with id ${id} not found`);
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }

    this.logger.log(`Found learn plan with id: ${id} for user: ${userId}`);
    return learnPlan;
  }

  async create(createLearnPlanDto: CreateLearnPlanDto): Promise<LearnPlanDto> {
    const { userId, targetLanguage, level } = createLearnPlanDto;
    this.logger.log(
      `Creating learn plan for user: ${userId}, language: ${targetLanguage}, level: ${level}`,
    );

    const user = await this.userProfileService.findOne(userId);
    const language = await this.languageService.findOne(targetLanguage);

    await this.existLearnPlanByUserAndTargetLanguageAndLevel(
      user,
      language,
      level,
    );

    const learnPlan = this.learnPlansRepository.create({
      user,
      targetLanguage: language,
      level,
    });

    await this.learnPlansRepository.save(learnPlan);

    this.logger.log(
      `Created learn plan for user: ${userId}, language: ${targetLanguage}, level: ${level}`,
    );
    return new LearnPlanDto(learnPlan);
  }

  async delete(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting learn plan with id: ${id} for user: ${userId}`);
    const user = await this.userProfileService.findOne(userId);

    const result = await this.learnPlansRepository.delete({ id, user });
    if (result.affected === 0) {
      this.logger.error(
        `Learn plan with id ${id} not found for user: ${userId}`,
      );
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
    this.logger.log(`Deleted learn plan with id: ${id} for user: ${userId}`);
  }

  private async existLearnPlanByUserAndTargetLanguageAndLevel(
    user: UserProfile,
    targetLanguage: Language,
    level: LanguageLevel,
  ) {
    if (
      await this.learnPlansRepository.existsBy({ user, targetLanguage, level })
    ) {
      this.logger.error(
        `Duplicate learn plan with: ${user.userId} | ${targetLanguage.code} | ${level}`,
      );
      throw new ConflictException(
        `Duplicate learn plan for user: ${user.userId}`,
      );
    }
  }
}
