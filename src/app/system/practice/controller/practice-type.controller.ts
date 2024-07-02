import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/create-practice-type.dto';
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/update-practice-type.dto';
import { PracticeTypeDto } from '@app/system/practice/dto/practice-type.dto';

@Controller('practiceTypes')
export class PracticeTypeController {
  constructor(private readonly practiceTypeService: PracticeTypeService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  create(@Body() createPracticeTypeDto: CreatePracticeTypeDto) {
    return this.practiceTypeService.create(createPracticeTypeDto);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findAll(): Promise<PracticeTypeDto[]> {
    const practiceTypes = await this.practiceTypeService.findAll();
    return practiceTypes.map(
      (practiceType) => new PracticeTypeDto(practiceType),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findOne(@Param('id') id: string): Promise<PracticeTypeDto> {
    const practiceType = await this.practiceTypeService.findOne(id);
    return new PracticeTypeDto(practiceType);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  update(
    @Param('id') id: string,
    @Body() updatePracticeTypeDto: UpdatePracticeTypeDto,
  ): Promise<PracticeTypeDto> {
    return this.practiceTypeService.update(id, updatePracticeTypeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.practiceTypeService.delete(id);
  }
}
