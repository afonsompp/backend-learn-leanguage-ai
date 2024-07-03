import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LanguagesService } from '@app/system/languages/service/languages.service';
import { LanguageDto } from '@app/system/languages/dto/language.dto';
import { CreateLanguageDto } from '@app/system/languages/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/languages/dto/update-language.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('languages')
@ApiBearerAuth()
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  findAll(): Promise<LanguageDto[]> {
    return this.languagesService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<LanguageDto> {
    return new LanguageDto(await this.languagesService.findOne(code));
  }

  @Post()
  create(@Body() language: CreateLanguageDto): Promise<LanguageDto> {
    return this.languagesService.create(language);
  }

  @Put(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() language: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    return this.languagesService.update(id, language);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.languagesService.delete(id);
  }
}
