import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/create-practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/update-practice-type.dto';
import { PracticeTypeDto } from '@app/system/practice/dto/practice-type.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('practiceTypes')
@ApiBearerAuth()
export class PracticeTypeController {
  constructor(private readonly practiceTypeService: PracticeTypeService) {}

  @Post()
  create(@Body() createPracticeTypeDto: CreatePracticeTypeDto) {
    return this.practiceTypeService.create(createPracticeTypeDto);
  }

  @Get()
  async findAll(): Promise<PracticeTypeDto[]> {
    const practiceTypes = await this.practiceTypeService.findAll();
    return practiceTypes.map(
      (practiceType) => new PracticeTypeDto(practiceType),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PracticeTypeDto> {
    const practiceType = await this.practiceTypeService.findOne(id);
    return new PracticeTypeDto(practiceType);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePracticeTypeDto: UpdatePracticeTypeDto,
  ): Promise<PracticeTypeDto> {
    return this.practiceTypeService.update(id, updatePracticeTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.practiceTypeService.delete(id);
  }
}
