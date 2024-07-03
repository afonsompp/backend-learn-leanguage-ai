import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { LanguageDto } from '@app/system/languages/dto/language.dto';
import { CreateLanguageDto } from '@app/system/languages/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/languages/dto/update-language.dto';

@Injectable()
export class LanguagesService {
  private readonly logger = new Logger(LanguagesService.name);

  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<LanguageDto[]> {
    this.logger.log('Fetching all languages');
    const languages = await this.languagesRepository.find();
    this.logger.log(`Found ${languages.length} languages`);
    return languages.map((language) => new LanguageDto(language));
  }

  async findOne(code: string): Promise<Language> {
    this.logger.log(`Fetching language with code: ${code}`);
    const language = await this.languagesRepository.findOne({
      where: { code },
    });
    if (!language) {
      this.logger.warn(`Language with code ${code} not found`);
      throw new NotFoundException(`Language with code ${code} not found`);
    }
    this.logger.log(`Found language with code: ${code}`);
    return language;
  }

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    this.logger.log(`Creating language with code: ${createLanguageDto.code}`);
    if (
      await this.languagesRepository.existsBy({
        code: createLanguageDto.code,
      })
    ) {
      this.logger.warn(
        `Language with code ${createLanguageDto.code} already exists`,
      );
      throw new ConflictException(
        `Language with code ${createLanguageDto.code} already exists`,
      );
    }
    const createdLanguage = this.languagesRepository.create(createLanguageDto);
    await this.languagesRepository.save(createdLanguage);
    this.logger.log(`Created language with code: ${createLanguageDto.code}`);
    return new LanguageDto(createdLanguage);
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    this.logger.log(`Updating language with id: ${id}`);
    const result = await this.languagesRepository.update(
      { id },
      updateLanguageDto,
    );
    if (result.affected === 0) {
      this.logger.warn(`Language with id ${id} not found`);
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    const updatedLanguage = await this.languagesRepository.findOne({
      where: { id },
    });
    this.logger.log(`Updated language with id: ${id}`);
    return new LanguageDto(updatedLanguage);
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting language with id: ${id}`);
    const result = await this.languagesRepository.delete({ id });
    if (result.affected === 0) {
      this.logger.warn(`Language with id ${id} not found`);
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    this.logger.log(`Deleted language with id: ${id}`);
  }
}
