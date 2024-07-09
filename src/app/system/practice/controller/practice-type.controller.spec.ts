import { PracticeTypeController } from '@app/system/practice/controller/practice-type.controller';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/create-practice-type.dto';
import { PracticeTypeDto } from '@app/system/practice/dto/practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/update-practice-type.dto';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';

describe('PracticeTypeController', () => {
  let controller: PracticeTypeController;
  let service: PracticeTypeService;

  const mockPracticeTypeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeTypeController],
      providers: [
        {
          provide: PracticeTypeService,
          useValue: mockPracticeTypeService,
        },
      ],
    }).compile();

    controller = module.get<PracticeTypeController>(PracticeTypeController);
    service = module.get<PracticeTypeService>(PracticeTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new practice type', async () => {
      const dto: CreatePracticeTypeDto = {
        name: 'test',
        model: 'gpt',
        topP: 1,
        temperature: 1,
        instruction: 'test',
      };
      mockPracticeTypeService.create.mockReturnValue(Promise.resolve(dto));

      expect(await controller.create(dto)).toEqual(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of practice types', async () => {
      const result = [new PracticeTypeDto(new PracticeType())];
      mockPracticeTypeService.findAll.mockReturnValue(Promise.resolve(result));

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single practice type', async () => {
      const result = new PracticeTypeDto(new PracticeType());
      mockPracticeTypeService.findOne.mockReturnValue(Promise.resolve(result));

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a practice type', async () => {
      const dto: UpdatePracticeTypeDto = {
        instruction: 'updated test',
        model: 'gpt',
        topP: 1,
        temperature: 1,
      };
      const result = new PracticeTypeDto(new PracticeType());
      mockPracticeTypeService.update.mockReturnValue(Promise.resolve(result));

      expect(await controller.update('1', dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a practice type', async () => {
      mockPracticeTypeService.delete.mockReturnValue(Promise.resolve());

      expect(await controller.remove('1')).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
