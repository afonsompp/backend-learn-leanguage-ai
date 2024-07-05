import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageDto } from '@app/system/language/dto/language.dto';
import { CreateLanguageDto } from '@app/system/language/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/language/dto/update-language.dto';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);

  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<LanguageDto[]> {
    this.logger.log('Fetching all languages');
    const languages = await this.languageRepository.find();
    this.logger.log(`Found ${languages.length} languages`);
    return languages.map((language) => new LanguageDto(language));
  }

  async findOne(code: string): Promise<Language> {
    this.logger.log(`Fetching language with code: ${code}`);
    const language = await this.languageRepository.findOne({
      where: { code },
    });
    if (!language) {
      this.logger.warn(`Language with code ${code} not found`);
      throw new NotFoundException(`Language with code ${code} not found`);
    }
    this.logger.log(`Found language with code: ${code}`);
    return language;
  }

  async findById(id: number): Promise<Language> {
    this.logger.log(`Fetching language with id: ${id}`);
    const language = await this.languageRepository.findOne({
      where: { id },
    });
    if (!language) {
      this.logger.warn(`Language with id ${id} not found`);
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    this.logger.log(`Found language with id: ${id}`);
    return language;
  }

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    this.logger.log(`Creating language with code: ${createLanguageDto.code}`);

    await this.existByCode(createLanguageDto.code);

    const createdLanguage = this.languageRepository.create(createLanguageDto);
    await this.languageRepository.save(createdLanguage);
    this.logger.log(`Created language with code: ${createLanguageDto.code}`);
    return new LanguageDto(createdLanguage);
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    this.logger.log(`Updating language with id: ${id}`);

    const language = await this.findById(id);

    await this.existByCode(updateLanguageDto.code);

    const updatedLanguage = Object.assign(language, updateLanguageDto);

    await this.languageRepository.save(updateLanguageDto);
    this.logger.log(`Updated language with id: ${id}`);
    return new LanguageDto(updatedLanguage);
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting language with id: ${id}`);
    const result = await this.languageRepository.delete({ id });
    if (result.affected === 0) {
      this.logger.warn(`Language with id ${id} not found`);
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    this.logger.log(`Deleted language with id: ${id}`);
  }

  private async existByCode(code: string) {
    if (await this.languageRepository.existsBy({ code })) {
      this.logger.warn(`Language with code ${code} already exists`);
      throw new ConflictException(`Language with code ${code} already exists`);
    }
  }
}
