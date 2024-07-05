import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/create-practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/update-practice-type.dto';
import { PracticeTypeDto } from '@app/system/practice/dto/practice-type.dto';

@Injectable()
export class PracticeTypeService {
  private readonly logger = new Logger(PracticeTypeService.name);

  constructor(
    @InjectRepository(PracticeType)
    private practiceTypesRepository: Repository<PracticeType>,
  ) {}

  async findAll(): Promise<PracticeType[]> {
    this.logger.log('Fetching all practice types');
    const practiceTypes = await this.practiceTypesRepository.find();
    this.logger.log(`Found ${practiceTypes.length} practice types`);
    return practiceTypes;
  }

  async findOne(id: string): Promise<PracticeType> {
    this.logger.log(`Fetching practice type with id: ${id}`);
    const practiceType = await this.practiceTypesRepository.findOne({
      where: { id },
    });
    if (!practiceType) {
      this.logger.warn(`PracticeType with id ${id} not found`);
      throw new NotFoundException(`PracticeType with id ${id} not found`);
    }
    this.logger.log(`Found practice type with id: ${id}`);
    return practiceType;
  }

  async create(
    createPracticeTypeDto: CreatePracticeTypeDto,
  ): Promise<PracticeTypeDto> {
    this.logger.log(
      `Creating practice type with name: ${createPracticeTypeDto.name}`,
    );
    const existingPracticeType = await this.practiceTypesRepository.findOne({
      where: { name: createPracticeTypeDto.name },
    });
    if (existingPracticeType) {
      this.logger.warn(
        `PracticeType with name ${createPracticeTypeDto.name} already exists`,
      );
      throw new ConflictException(
        `PracticeType with name ${createPracticeTypeDto.name} already exists`,
      );
    }
    const createdPracticeType = this.practiceTypesRepository.create(
      createPracticeTypeDto,
    );
    await this.practiceTypesRepository.save(createdPracticeType);
    this.logger.log(
      `Created practice type with name: ${createPracticeTypeDto.name}`,
    );
    return new PracticeTypeDto(createdPracticeType);
  }

  async update(
    id: string,
    updatePracticeTypeDto: UpdatePracticeTypeDto,
  ): Promise<PracticeTypeDto> {
    this.logger.log(`Updating practice type with id: ${id}`);
    const practiceType = await this.findOne(id);

    Object.assign(practiceType, updatePracticeTypeDto);
    const updatedPracticeType =
      await this.practiceTypesRepository.save(practiceType);
    this.logger.log(`Updated practice type with id: ${id}`);
    return new PracticeTypeDto(updatedPracticeType);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting practice type with id: ${id}`);
    const result = await this.practiceTypesRepository.delete({ id });
    if (result.affected === 0) {
      this.logger.warn(`PracticeType with id ${id} not found`);
      throw new NotFoundException(`PracticeType with id ${id} not found`);
    }
    this.logger.log(`Deleted practice type with id: ${id}`);
  }
}
