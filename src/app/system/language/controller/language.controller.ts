import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LanguageService } from '@app/system/language/service/language.service';
import { LanguageDto } from '@app/system/language/dto/language.dto';
import { CreateLanguageDto } from '@app/system/language/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/language/dto/update-language.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('languages')
@ApiBearerAuth()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  findAll(): Promise<LanguageDto[]> {
    return this.languageService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<LanguageDto> {
    return new LanguageDto(await this.languageService.findOne(code));
  }

  @Post()
  create(@Body() language: CreateLanguageDto): Promise<LanguageDto> {
    return this.languageService.create(language);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() language: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    return this.languageService.update(id, language);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.languageService.delete(id);
  }
}
