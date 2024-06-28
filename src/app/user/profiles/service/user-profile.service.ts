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
import { Language } from '@app/system/languages/entities/language.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  async findOne(idProvider: string): Promise<ProfileDto> {
    const profile = await this.profilesRepository.findOne({
      where: { idProvider },
      relations: ['nativeLanguage'],
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile with idProvider ${idProvider} not found`,
      );
    }
    return new ProfileDto(profile);
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
    const language = await this.languagesRepository.findOne({
      where: { code: nativeLanguage },
    });

    if (!language) {
      throw new NotFoundException(
        `Language with code ${nativeLanguage} not found`,
      );
    }

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
      const language = await this.languagesRepository.findOne({
        where: { code: nativeLanguage },
      });

      if (!language) {
        throw new NotFoundException(
          `Language with code ${nativeLanguage} not found`,
        );
      }

      profile.nativeLanguage = language;
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
