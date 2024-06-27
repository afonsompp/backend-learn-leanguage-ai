import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LanguagesService } from '../service/languages.service';
import { LanguageDto } from '../dto/language.dto';
import { UpdateLanguageDto } from '../dto/update-language.dto';
import { CreateLanguageDto } from '../dto/create-language.dto';

@Controller('system/languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  findAll(): Promise<LanguageDto[]> {
    return this.languagesService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string): Promise<LanguageDto> {
    return this.languagesService.findOne(code);
  }

  @Post()
  create(@Body() language: CreateLanguageDto): Promise<LanguageDto> {
    return this.languagesService.create(language);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() language: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    return this.languagesService.update(id, language);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: number): Promise<void> {
    return this.languagesService.delete(id);
  }
}
