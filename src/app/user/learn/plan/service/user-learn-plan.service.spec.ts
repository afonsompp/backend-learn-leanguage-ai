import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';
import { UserProfileService } from '@app/user/profile/service/user-profile.service';
import { LanguageService } from '@app/system/language/service/language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { LearnPlanDto } from '@app/user/learn/plan/dto/learn-plan.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLearnPlanDto } from '@app/user/learn/plan/dto/create-learn-plan.dto';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';
import { Language } from '@app/system/language/entities/language.entity';

describe('LearnPlanService', () => {
  let service: LearnPlanService;

  const mockLearnPlansRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    existsBy: jest.fn(),
  };

  const mockUserProfileService = {
    findOne: jest.fn(),
  };

  const mockLanguageService = {
    findOne: jest.fn(),
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
      providers: [
        LearnPlanService,
        {
          provide: getRepositoryToken(UserLearnPlan),
          useValue: mockLearnPlansRepository,
        },
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
        {
          provide: LanguageService,
          useValue: mockLanguageService,
        },
      ],
    }).compile();

    service = module.get<LearnPlanService>(LearnPlanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of LearnPlanDto', async () => {
      const userId = 'user-uuid';
      const mockUserLearnPlan = mockLearnPlan;
      mockLearnPlansRepository.find.mockResolvedValue([mockUserLearnPlan]);
      mockUserProfileService.findOne.mockResolvedValue(mockLearnPlan.user);

      const result = await service.findAll(userId);
      expect(result).toEqual([new LearnPlanDto(mockUserLearnPlan)]);
      expect(mockLearnPlansRepository.find).toHaveBeenCalledWith({
        where: { user: mockLearnPlan.user },
        relations: ['user', 'targetLanguage'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a UserLearnPlan', async () => {
      const id = 'learn-plan-uuid';
      const userId = 'user-uuid';
      const mockUserLearnPlan = new UserLearnPlan();
      mockUserLearnPlan.user = { userId } as UserProfile;
      mockLearnPlansRepository.findOne.mockResolvedValue(mockUserLearnPlan);

      const result = await service.findOne(id, userId);
      expect(result).toEqual(mockUserLearnPlan);
    });

    it('should throw a NotFoundException if plan is not found', async () => {
      const id = 'learn-plan-uuid';
      const userId = 'user-uuid';
      mockLearnPlansRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an UnauthorizedException if user is not authorized', async () => {
      const id = 'learn-plan-uuid';
      const userId = 'user-uuid';
      const mockUserLearnPlan = new UserLearnPlan();
      mockUserLearnPlan.user = { userId: 'other-user' } as UserProfile;
      mockLearnPlansRepository.findOne.mockResolvedValue(mockUserLearnPlan);

      await expect(service.findOne(id, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new LearnPlanDto', async () => {
      const createLearnPlanDto: CreateLearnPlanDto = {
        userId: mockLearnPlan.user.userId,
        targetLanguage: 'language-uuid',
        level: LanguageLevel.BEGINNER,
      };

      const mockUser = mockLearnPlan.user;
      const mockLanguage = new Language();
      const mockUserLearnPlan = mockLearnPlan;
      mockUserProfileService.findOne.mockResolvedValue(mockUser);
      mockLanguageService.findOne.mockResolvedValue(mockLanguage);
      mockLearnPlansRepository.existsBy.mockResolvedValue(false);
      mockLearnPlansRepository.create.mockReturnValue(mockUserLearnPlan);
      mockLearnPlansRepository.save.mockResolvedValue(mockUserLearnPlan);

      const result = await service.create(createLearnPlanDto);
      expect(result).toEqual(new LearnPlanDto(mockUserLearnPlan));
      expect(mockLearnPlansRepository.save).toHaveBeenCalledWith(
        mockUserLearnPlan,
      );
    });

    it('should throw a ConflictException if learn plan already exists', async () => {
      const createLearnPlanDto: CreateLearnPlanDto = {
        userId: 'user-uuid',
        targetLanguage: 'language-uuid',
        level: LanguageLevel.BEGINNER,
      };

      const mockUser = new UserProfile();
      const mockLanguage = new Language();
      mockUserProfileService.findOne.mockResolvedValue(mockUser);
      mockLanguageService.findOne.mockResolvedValue(mockLanguage);
      mockLearnPlansRepository.existsBy.mockResolvedValue(true);

      await expect(service.create(createLearnPlanDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a learn plan', async () => {
      const id = 'learn-plan-uuid';
      const userId = 'user-uuid';
      const mockUser = new UserProfile();
      mockUserProfileService.findOne.mockResolvedValue(mockUser);
      mockLearnPlansRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(id, userId);
      expect(mockLearnPlansRepository.delete).toHaveBeenCalledWith({
        id,
        user: mockUser,
      });
    });

    it('should throw a NotFoundException if learn plan is not found', async () => {
      const id = 'learn-plan-uuid';
      const userId = 'user-uuid';
      const mockUser = new UserProfile();
      mockUserProfileService.findOne.mockResolvedValue(mockUser);
      mockLearnPlansRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
