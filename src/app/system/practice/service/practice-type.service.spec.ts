import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/create-practice-type.dto';
import { PracticeTypeDto } from '@app/system/practice/dto/practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/update-practice-type.dto';

describe('PracticeTypeService', () => {
  let service: PracticeTypeService;
  let repository: Repository<PracticeType>;

  const mockPracticeTypeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeTypeService,
        {
          provide: getRepositoryToken(PracticeType),
          useValue: mockPracticeTypeRepository,
        },
        Logger,
      ],
    }).compile();

    service = module.get<PracticeTypeService>(PracticeTypeService);
    repository = module.get<Repository<PracticeType>>(
      getRepositoryToken(PracticeType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of practice types', async () => {
      const result = [new PracticeType()];
      mockPracticeTypeRepository.find.mockReturnValue(Promise.resolve(result));

      expect(await service.findAll()).toEqual(result);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single practice type', async () => {
      const id = '1';
      const result = new PracticeType();
      mockPracticeTypeRepository.findOne.mockReturnValue(
        Promise.resolve(result),
      );

      expect(await service.findOne(id)).toEqual(result);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw a NotFoundException if the practice type does not exist', async () => {
      const id = '1';
      mockPracticeTypeRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('create', () => {
    it('should create and return a new practice type', async () => {
      const dto: CreatePracticeTypeDto = {
        name: 'test',
        model: 'gpt',
        topP: 1,
        temperature: 1,
        instruction: 'test',
      };
      const practiceType = new PracticeType();
      mockPracticeTypeRepository.findOne.mockReturnValue(Promise.resolve(null));
      mockPracticeTypeRepository.create.mockReturnValue(practiceType);
      mockPracticeTypeRepository.save.mockReturnValue(
        Promise.resolve(practiceType),
      );

      expect(await service.create(dto)).toEqual(
        new PracticeTypeDto(practiceType),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(practiceType);
    });

    it('should throw a ConflictException if the practice type already exists', async () => {
      const dto: CreatePracticeTypeDto = {
        name: 'test',
        model: 'gpt',
        topP: 1,
        temperature: 1,
        instruction: 'test',
      };
      const existingPracticeType = new PracticeType();
      mockPracticeTypeRepository.findOne.mockReturnValue(
        Promise.resolve(existingPracticeType),
      );

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
    });
  });

  describe('update', () => {
    it('should update and return an existing practice type', async () => {
      const id = '1';
      const dto: UpdatePracticeTypeDto = {
        model: 'gpt',
        topP: 1,
        temperature: 1,
        instruction: 'test',
      };
      const practiceType = new PracticeType();
      mockPracticeTypeRepository.findOne.mockReturnValue(
        Promise.resolve(practiceType),
      );
      mockPracticeTypeRepository.save.mockReturnValue(
        Promise.resolve(practiceType),
      );

      expect(await service.update(id, dto)).toEqual(
        new PracticeTypeDto(practiceType),
      );
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.save).toHaveBeenCalledWith(practiceType);
    });

    it('should throw a NotFoundException if the practice type does not exist', async () => {
      const id = '1';
      const dto: UpdatePracticeTypeDto = {
        model: 'gpt',
        topP: 1,
        temperature: 1,
        instruction: 'test',
      };
      mockPracticeTypeRepository.findOne.mockReturnValue(Promise.resolve(null));

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('delete', () => {
    it('should delete an existing practice type', async () => {
      const id = '1';
      mockPracticeTypeRepository.delete.mockReturnValue(
        Promise.resolve({ affected: 1 }),
      );

      await expect(service.delete(id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith({ id });
    });

    it('should throw a NotFoundException if the practice type does not exist', async () => {
      const id = '1';
      mockPracticeTypeRepository.delete.mockReturnValue(
        Promise.resolve({ affected: 0 }),
      );

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith({ id });
    });
  });
});
