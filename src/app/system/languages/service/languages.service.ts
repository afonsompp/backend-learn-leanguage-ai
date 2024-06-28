import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '../entities/language.entity';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { LanguageDto } from '../dto/language.dto';
import { UpdateLanguageDto } from '../dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<LanguageDto[]> {
    const languages = await this.languagesRepository.find();
    return languages.map((language) => new LanguageDto(language));
  }

  async findOne(code: string): Promise<LanguageDto> {
    const language = await this.languagesRepository.findOne({
      where: { code },
    });
    if (!language) {
      throw new NotFoundException(`Language with code ${code} not found`);
    }
    return new LanguageDto(language);
  }

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageDto> {
    if (
      await this.languagesRepository.existsBy({
        code: createLanguageDto.code,
      })
    ) {
      throw new ConflictException(
        `Language with code ${createLanguageDto.code} already exists`,
      );
    }
    const createdLanguage = this.languagesRepository.create(createLanguageDto);
    await this.languagesRepository.save(createdLanguage);
    return new LanguageDto(createdLanguage);
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    const result = await this.languagesRepository.update(
      { id },
      updateLanguageDto,
    );
    if (result.affected === 0) {
      throw new NotFoundException(`Language with id ${id} not found`);
    }
    const updatedLanguage = await this.languagesRepository.findOne({
      where: { id },
    });
    return new LanguageDto(updatedLanguage);
  }

  async delete(id: number): Promise<void> {
    const result = await this.languagesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Language with code ${id} not found`);
    }
  }
}
