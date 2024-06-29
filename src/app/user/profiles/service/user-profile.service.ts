import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileDto } from '../dto/profile.dto';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';
import { LanguagesService } from '@app/system/languages/service/languages.service';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
    private readonly languagesService: LanguagesService,
  ) {}

  async findOne(idProvider: string): Promise<UserProfile> {
    const profile = await this.profilesRepository.findOne({
      where: { idProvider },
      relations: ['nativeLanguage'],
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile with idProvider ${idProvider} not found`,
      );
    }
    return profile;
  }

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDto> {
    const { nativeLanguage, ...profileData } = createProfileDto;

    if (
      await this.profilesRepository.existsBy({
        ...profileData,
      })
    ) {
      throw new ConflictException('user already have a profile');
    }
    const language = await this.languagesService.findOne(nativeLanguage);

    const profile = this.profilesRepository.create({
      ...profileData,
      nativeLanguage: language,
    });

    await this.profilesRepository.save(profile);

    return new ProfileDto(profile);
  }

  async update(
    idProvider: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const { nativeLanguage } = updateProfileDto;

    const profile = await this.profilesRepository.findOne({
      where: { idProvider },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile with id provider ${idProvider} not found`,
      );
    }

    if (nativeLanguage) {
      profile.nativeLanguage =
        await this.languagesService.findOne(nativeLanguage);
    }

    await this.profilesRepository.update({ idProvider }, profile);

    return new ProfileDto(profile);
  }

  async delete(id: string): Promise<void> {
    const result = await this.profilesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
  }
}
