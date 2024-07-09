import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageService } from '@app/system/language/service/language.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageDto } from '@app/system/language/dto/language.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from '@app/system/language/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/language/dto/update-language.dto';

describe('LanguageService', () => {
  let service: LanguageService;
  let repository: Repository<Language>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: getRepositoryToken(Language),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LanguageService>(LanguageService);
    repository = module.get<Repository<Language>>(getRepositoryToken(Language));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of languages', async () => {
      const languages = [new Language()];
      jest.spyOn(repository, 'find').mockResolvedValue(languages);

      expect(await service.findAll()).toEqual(
        languages.map((lang) => new LanguageDto(lang)),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single language', async () => {
      const code = 'en';
      const language = new Language();
      jest.spyOn(repository, 'findOne').mockResolvedValue(language);

      expect(await service.findOne(code)).toEqual(language);
    });

    it('should throw NotFoundException if language not found', async () => {
      const code = 'en';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(code)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a language by id', async () => {
      const id = 1;
      const language = new Language();
      jest.spyOn(repository, 'findOne').mockResolvedValue(language);

      expect(await service.findById(id)).toEqual(language);
    });

    it('should throw NotFoundException if language not found by id', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new language', async () => {
      const createLanguageDto = new CreateLanguageDto();
      const language = new Language();
      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(repository, 'create').mockReturnValue(language);
      jest.spyOn(repository, 'save').mockResolvedValue(language);

      expect(await service.create(createLanguageDto)).toEqual(
        new LanguageDto(language),
      );
    });

    it('should throw ConflictException if language code already exists', async () => {
      const createLanguageDto = new CreateLanguageDto();
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);

      await expect(service.create(createLanguageDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the language', async () => {
      const id = 1;
      const updateLanguageDto = new UpdateLanguageDto();
      const language = new Language();
      jest.spyOn(repository, 'findOne').mockResolvedValue(language);
      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(repository, 'save').mockResolvedValue(language);

      expect(await service.update(id, updateLanguageDto)).toEqual(
        new LanguageDto(language),
      );
    });

    it('should throw NotFoundException if language not found by id', async () => {
      const id = 1;
      const updateLanguageDto = new UpdateLanguageDto();
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, updateLanguageDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if language code already exists', async () => {
      const id = 1;
      const updateLanguageDto = new UpdateLanguageDto();
      const language = new Language();
      jest.spyOn(repository, 'findOne').mockResolvedValue(language);
      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);

      await expect(service.update(id, updateLanguageDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the language', async () => {
      const id = 1;
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ raw: null, affected: 1 });

      await expect(service.delete(id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if language not found', async () => {
      const id = 1;
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ raw: null, affected: 0 });

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
