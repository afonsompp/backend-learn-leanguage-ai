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
import { UpdatePracticeTypeDto } from '@app/system/practice/dto/pratice-type/update-practice-type.dto';
import { CreatePracticeTypeDto } from '@app/system/practice/dto/pratice-type/create-practice-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';

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
  findAll() {
    return this.practiceTypeService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  findOne(@Param('id') id: string) {
    return this.practiceTypeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  update(
    @Param('id') id: string,
    @Body() updatePracticeTypeDto: UpdatePracticeTypeDto,
  ) {
    return this.practiceTypeService.update(id, updatePracticeTypeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  remove(@Param('id') id: string) {
    return this.practiceTypeService.delete(id);
  }
}
