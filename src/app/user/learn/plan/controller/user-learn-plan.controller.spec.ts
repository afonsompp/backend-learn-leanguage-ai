import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LearnPlansController } from '@app/user/learn/plan/controller/user-learn-plan.controller';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

describe('LearnPlansController', () => {
  let controller: LearnPlansController;
  let service: LearnPlanService;

  const mockLearnPlanService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRequest = {
    user: {
      sub: 'userId',
    },
  };

  const mockLearnPlan: UserLearnPlan = {
    id: '1',
    level: LanguageLevel.BEGINNER,
    user: {
      userId: '',
      id: '',
      userLearnPlans: null,
      nativeLanguage: { code: '', id: 1, name: '' },
    },
    targetLanguage: { code: '', id: 1, name: '' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearnPlansController],
      providers: [
        {
          provide: LearnPlanService,
          useValue: mockLearnPlanService,
        },
      ],
    }).compile();

    controller = module.get<LearnPlansController>(LearnPlansController);
    service = module.get<LearnPlanService>(LearnPlanService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of learn plans', async () => {
      const result = [new LearnPlanDto(mockLearnPlan)];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(mockUserRequest as UserRequest)).toBe(
        result,
      );
      expect(service.findAll).toHaveBeenCalledWith(mockUserRequest.user.sub);
    });
  });

  describe('findOne', () => {
    it('should return a single learn plan', async () => {
      const result = new LearnPlanDto(mockLearnPlan);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockLearnPlan);

      expect(
        await controller.findOne(mockUserRequest as UserRequest, 'planId'),
      ).toStrictEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(
        'planId',
        mockUserRequest.user.sub,
      );
    });

    it('should throw a NotFoundException if the learn plan is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        controller.findOne(mockUserRequest as UserRequest, 'planId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a learn plan', async () => {
      const createDto = new CreateLearnPlanDto();
      const result = new LearnPlanDto(mockLearnPlan);
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(
        await controller.create(mockUserRequest as UserRequest, createDto),
      ).toBe(result);
      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        userId: mockUserRequest.user.sub,
      });
    });
  });

  describe('delete', () => {
    it('should delete a learn plan', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(
        controller.delete(mockUserRequest as UserRequest, 'planId'),
      ).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(
        'planId',
        mockUserRequest.user.sub,
      );
    });
  });
});
