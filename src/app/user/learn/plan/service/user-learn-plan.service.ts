import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { UserProfileService } from '@app/user/profiles/service/user-profile.service';
import { LanguagesService } from '@app/system/languages/service/languages.service';

@Injectable()
export class LearnPlansService {
  private readonly logger = new Logger(LearnPlansService.name);

  constructor(
    @InjectRepository(UserLearnPlan)
    private learnPlansRepository: Repository<UserLearnPlan>,
    private readonly userProfileService: UserProfileService,
    private readonly languagesService: LanguagesService,
  ) {}

  async findAll(userId: string): Promise<LearnPlanDto[]> {
    this.logger.log(`Fetching all learn plans for user: ${userId}`);
    const user = await this.userProfileService.findOne(userId);

    const userLearnPlans = await this.learnPlansRepository.find({
      where: { user },
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
      where: { id },
      relations: ['user', 'targetLanguage'],
    });
    if (!learnPlan) {
      this.logger.warn(`Learn plan with id ${id} not found`);
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }

    if (learnPlan.user.userId !== userId) {
      this.logger.warn(
        `User ${userId} is not authorized to access learn plan with id ${id}`,
      );
      throw new UnauthorizedException(
        'User does not have access to this resource',
      );
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
    const language = await this.languagesService.findOne(targetLanguage);

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
      this.logger.warn(
        `Learn plan with id ${id} not found for user: ${userId}`,
      );
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
    this.logger.log(`Deleted learn plan with id: ${id} for user: ${userId}`);
  }
}
