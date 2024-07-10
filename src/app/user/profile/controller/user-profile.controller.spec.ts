import { UserProfileController } from '@app/user/profile/controller/user-profile.controller';
import { UserProfileService } from '@app/user/profile/service/user-profile.service';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProfileDto } from '@app/user/profile/dto/create-profile.dto';
import { ProfileDto } from '@app/user/profile/dto/profile.dto';
import { UpdateProfileDto } from '@app/user/profile/dto/update-profile.dto';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';

describe('UserProfileController', () => {
  let controller: UserProfileController;
  let service: UserProfileService;

  const mockUserProfileService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRequest: Partial<UserRequest> = {
    user: {
      sub: 'userId',
      iss: '',
      exp: 1,
      aud: '',
    },
  };

  const user: UserProfile = {
    userId: '',
    id: '',
    userLearnPlans: null,
    nativeLanguage: { code: '', id: 1, name: '' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
      ],
    }).compile();

    controller = module.get<UserProfileController>(UserProfileController);
    service = module.get<UserProfileService>(UserProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const dto: CreateProfileDto = { nativeLanguage: 'en-US', userId: '1212' };
      const result = new ProfileDto(user);
      mockUserProfileService.create.mockReturnValue(Promise.resolve(result));

      expect(
        await controller.create(mockUserRequest as UserRequest, dto),
      ).toEqual(result);
      expect(dto.userId).toEqual(mockUserRequest.user.sub);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const dto: UpdateProfileDto = { nativeLanguage: 'en-US' };
      const result = new ProfileDto(user);
      mockUserProfileService.update.mockReturnValue(Promise.resolve(result));

      expect(
        await controller.update(mockUserRequest as UserRequest, dto),
      ).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(
        mockUserRequest.user.sub,
        dto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single profile', async () => {
      mockUserProfileService.findOne.mockReturnValue(Promise.resolve(user));

      expect(await controller.findOne(mockUserRequest as UserRequest)).toEqual(
        new ProfileDto(user),
      );
      expect(service.findOne).toHaveBeenCalledWith(mockUserRequest.user.sub);
    });
  });

  describe('delete', () => {
    it('should delete a profile', async () => {
      const id = 'userId';
      mockUserProfileService.delete.mockReturnValue(Promise.resolve());

      await expect(controller.delete(id)).resolves.toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
