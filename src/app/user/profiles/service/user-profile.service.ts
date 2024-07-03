import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';
import { LanguagesService } from '@app/system/languages/service/languages.service';
import { CreateProfileDto } from '@app/user/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from '@app/user/profiles/dto/update-profile.dto';
import { ProfileDto } from '@app/user/profiles/dto/profile.dto';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
    private readonly languagesService: LanguagesService,
  ) {}

  async findOne(userId: string): Promise<UserProfile> {
    this.logger.log(`Fetching profile for userId: ${userId}`);
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ['nativeLanguage'],
    });
    if (!profile) {
      this.logger.warn(`Profile with userId ${userId} not found`);
      throw new NotFoundException(`Profile with userId ${userId} not found`);
    }
    this.logger.log(`Found profile for userId: ${userId}`);
    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDto> {
    const { nativeLanguage, ...profileData } = createProfileDto;

    this.logger.log(`Creating profile for userId: ${profileData.userId}`);

    if (
      await this.profilesRepository.existsBy({
        ...profileData,
      })
    ) {
      this.logger.warn(
        `Profile already exists for userId: ${profileData.userId}`,
      );
      throw new ConflictException('User already has a profile');
    }

    const language = await this.languagesService.findOne(nativeLanguage);

    const profile = this.profilesRepository.create({
      ...profileData,
      nativeLanguage: language,
    });

    await this.profilesRepository.save(profile);

    this.logger.log(`Created profile for userId: ${profileData.userId}`);
    return new ProfileDto(profile);
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const { nativeLanguage } = updateProfileDto;

    this.logger.log(`Updating profile for userId: ${userId}`);

    const profile = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      this.logger.warn(`Profile with userId ${userId} not found`);
      throw new NotFoundException(`Profile with userId ${userId} not found`);
    }

    if (nativeLanguage) {
      profile.nativeLanguage =
        await this.languagesService.findOne(nativeLanguage);
    }

    await this.profilesRepository.update({ userId }, profile);

    this.logger.log(`Updated profile for userId: ${userId}`);
    return new ProfileDto(profile);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting profile with id: ${id}`);
    const result = await this.profilesRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Profile with id ${id} not found`);
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    this.logger.log(`Deleted profile with id: ${id}`);
  }
}
