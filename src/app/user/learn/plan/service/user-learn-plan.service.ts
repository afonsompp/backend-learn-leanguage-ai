import { Injectable, NotFoundException } from '@nestjs/common';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { UserProfileService } from '@app/user/profiles/service/user-profile.service';
import { LanguagesService } from '@app/system/languages/service/languages.service';

@Injectable()
export class LearnPlansService {
  constructor(
    @InjectRepository(UserLearnPlan)
    private learnPlansRepository: Repository<UserLearnPlan>,
    private readonly userProfileService: UserProfileService,
    private readonly languagesService: LanguagesService,
  ) {}

  async findAll(idProvider: string): Promise<LearnPlanDto[]> {
    const user = await this.userProfileService.findOne(idProvider);

    const userLearnPlans = await this.learnPlansRepository.find({
      where: { user },
      relations: ['user', 'targetLanguage'],
    });
    return userLearnPlans.map(
      (userLearnPlan) => new LearnPlanDto(userLearnPlan),
    );
  }

  async findOne(id: string, idProvider: string): Promise<UserLearnPlan> {
    const user = await this.userProfileService.findOne(idProvider);

    const learnPlan = await this.learnPlansRepository.findOne({
      where: { id, user },
      relations: ['user', 'targetLanguage'],
    });
    if (!learnPlan) {
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
    return learnPlan;
  }

  async create(createLearnPlanDto: CreateLearnPlanDto): Promise<LearnPlanDto> {
    const { userId, targetLanguage, level } = createLearnPlanDto;

    const user = await this.userProfileService.findOne(userId);

    const language = await this.languagesService.findOne(targetLanguage);

    const learnPlan = this.learnPlansRepository.create({
      user,
      targetLanguage: language,
      level,
    });

    await this.learnPlansRepository.save(learnPlan);

    return new LearnPlanDto(learnPlan);
  }

  async delete(id: string, idProvider: string): Promise<void> {
    const user = await this.userProfileService.findOne(idProvider);

    const result = await this.learnPlansRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Learn plan with id ${id} not found`);
    }
  }
}
