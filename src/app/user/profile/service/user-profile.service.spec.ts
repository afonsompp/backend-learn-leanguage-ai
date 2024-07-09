import { UserProfileService } from '@app/user/profile/service/user-profile.service';
import { Repository } from 'typeorm';
import { LanguageService } from '@app/system/language/service/language.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from '@app/user/profile/dto/create-profile.dto';
import { ProfileDto } from '@app/user/profile/dto/profile.dto';
import { UpdateProfileDto } from '@app/user/profile/dto/update-profile.dto';

describe('UserProfileService', () => {
  let service: UserProfileService;
  let repository: Repository<UserProfile>;
  let languageService: LanguageService;

  const mockUserProfileRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsBy: jest.fn(),
  };

  const mockLanguageService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: getRepositoryToken(UserProfile),
          useValue: mockUserProfileRepository,
        },
        {
          provide: LanguageService,
          useValue: mockLanguageService,
        },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
    repository = module.get<Repository<UserProfile>>(
      getRepositoryToken(UserProfile),
    );
    languageService = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user profile', async () => {
      const userId = 'userId';
      const profile = new UserProfile();
      mockUserProfileRepository.findOne.mockReturnValue(
        Promise.resolve(profile),
      );

      expect(await service.findOne(userId)).toEqual(profile);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['nativeLanguage'],
      });
    });

    it('should throw a NotFoundException if the profile does not exist', async () => {
      const userId = 'userId';
      mockUserProfileRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['nativeLanguage'],
      });
    });
  });

  describe('create', () => {
    it('should create and return a new profile', async () => {
      const dto: CreateProfileDto = { userId: 'userId', nativeLanguage: 'en' };
      const language = { id: 1, code: 'en', name: 'English' };
      const user: UserProfile = {
        userId: 'userId',
        id: '',
        userLearnPlans: null,
        nativeLanguage: language,
      };

      mockUserProfileRepository.existsBy.mockReturnValue(
        Promise.resolve(false),
      );
      mockUserProfileRepository.create.mockReturnValue(user);
      mockUserProfileRepository.save.mockReturnValue(Promise.resolve(user));
      mockLanguageService.findOne.mockReturnValue(Promise.resolve(language));

      expect(await service.create(dto)).toEqual(new ProfileDto(user));
      expect(repository.existsBy).toHaveBeenCalledWith({ userId: dto.userId });
      expect(languageService.findOne).toHaveBeenCalledWith(dto.nativeLanguage);
      expect(repository.create).toHaveBeenCalledWith({
        ...dto,
        nativeLanguage: language,
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throw a ConflictException if the profile already exists', async () => {
      const dto: CreateProfileDto = { userId: 'userId', nativeLanguage: 'en' };
      mockUserProfileRepository.existsBy.mockReturnValue(Promise.resolve(true));

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.existsBy).toHaveBeenCalledWith({ userId: dto.userId });
    });
  });

  describe('update', () => {
    it('should update and return an existing profile', async () => {
      const userId = 'userId';
      const dto: UpdateProfileDto = { nativeLanguage: 'es' };
      const profile = new UserProfile();
      const language = { id: 'es', name: 'Spanish' };
      mockUserProfileRepository.findOne.mockReturnValue(
        Promise.resolve(profile),
      );
      mockUserProfileRepository.update.mockReturnValue(
        Promise.resolve(profile),
      );
      mockLanguageService.findOne.mockReturnValue(Promise.resolve(language));

      expect(await service.update(userId, dto)).toEqual(
        new ProfileDto(profile),
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(languageService.findOne).toHaveBeenCalledWith(dto.nativeLanguage);
      expect(repository.update).toHaveBeenCalledWith({ userId }, profile);
    });

    it('should throw a NotFoundException if the profile does not exist', async () => {
      const userId = 'userId';
      const dto: UpdateProfileDto = { nativeLanguage: 'es' };
      mockUserProfileRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(service.update(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { userId } });
    });
  });

  describe('delete', () => {
    it('should delete an existing profile', async () => {
      const id = 'profileId';
      mockUserProfileRepository.delete.mockReturnValue(
        Promise.resolve({ affected: 1 }),
      );

      await expect(service.delete(id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException if the profile does not exist', async () => {
      const id = 'profileId';
      mockUserProfileRepository.delete.mockReturnValue(
        Promise.resolve({ affected: 0 }),
      );

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });
  });
});
