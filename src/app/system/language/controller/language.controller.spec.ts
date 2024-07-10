import { LanguageService } from '@app/system/language/service/language.service';
import { LanguageController } from '@app/system/language/controller/language.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguageDto } from '@app/system/language/dto/language.dto';
import { Language } from '@app/system/language/entities/language.entity';
import { CreateLanguageDto } from '@app/system/language/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/language/dto/update-language.dto';

describe('LanguageController', () => {
  let controller: LanguageController;
  let service: LanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LanguageController>(LanguageController);
    service = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('should return an array of languages', async () => {
      const result = [new LanguageDto(new Language())];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single language', async () => {
      const code = 'en';
      const result = new LanguageDto(new Language());
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(code)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a language', async () => {
      const createLanguageDto = new CreateLanguageDto();
      const result = new LanguageDto(new Language());
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createLanguageDto)).toBe(result);
    });
  });
  describe('update', () => {
    it('should update a language', async () => {
      const id = 1;
      const updateLanguageDto = new UpdateLanguageDto();
      const result = new LanguageDto(new Language());
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(id, updateLanguageDto)).toBe(result);
    });
  });
  describe('delete', () => {
    it('should delete a language', async () => {
      const id = 1;
      jest.spyOn(service, 'delete').mockResolvedValue();

      await expect(controller.delete(id)).resolves.toBeUndefined();
    });
  });
});
