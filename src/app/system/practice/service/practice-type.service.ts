import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/pratice-type/create-practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/pratice-type/update-practice-type.dto';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';

@Injectable()
export class PracticeTypeService {
  constructor(
    @InjectRepository(PracticeType)
    private practiceTypesRepository: Repository<PracticeType>,
  ) {}

  async findAll(): Promise<PracticeType[]> {
    return this.practiceTypesRepository.find();
  }

  async findOne(id: string): Promise<PracticeType> {
    const practiceType = await this.practiceTypesRepository.findOne({
      where: { id },
    });
    if (!practiceType) {
      throw new NotFoundException(`PracticeType with id ${id} not found`);
    }
    return practiceType;
  }

  async create(
    createPracticeTypeDto: CreatePracticeTypeDto,
  ): Promise<PracticeType> {
    const existingPracticeType = await this.practiceTypesRepository.findOne({
      where: { name: createPracticeTypeDto.name },
    });
    if (existingPracticeType) {
      throw new ConflictException(
        `PracticeType with name ${createPracticeTypeDto.name} already exists`,
      );
    }
    const createdPracticeType = this.practiceTypesRepository.create(
      createPracticeTypeDto,
    );
    await this.practiceTypesRepository.save(createdPracticeType);
    return createdPracticeType;
  }

  async update(
    id: string,
    updatePracticeTypeDto: UpdatePracticeTypeDto,
  ): Promise<PracticeType> {
    const practiceType = await this.findOne(id);

    if (
      updatePracticeTypeDto.name &&
      updatePracticeTypeDto.name !== practiceType.name
    ) {
      const existingPracticeType = await this.practiceTypesRepository.findOne({
        where: { name: updatePracticeTypeDto.name },
      });
      if (existingPracticeType) {
        throw new ConflictException(
          `PracticeType with name ${updatePracticeTypeDto.name} already exists`,
        );
      }
    }

    Object.assign(practiceType, updatePracticeTypeDto);
    return this.practiceTypesRepository.save(practiceType);
  }

  async delete(id: string): Promise<void> {
    const result = await this.practiceTypesRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`PracticeType with id ${id} not found`);
    }
  }
}
