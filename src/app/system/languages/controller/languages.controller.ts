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
  UseGuards,
} from '@nestjs/common';
import { LanguagesService } from '@app/system/languages/service/languages.service';
import { LanguageDto } from '@app/system/languages/dto/language.dto';
import { CreateLanguageDto } from '@app/system/languages/dto/create-language.dto';
import { UpdateLanguageDto } from '@app/system/languages/dto/update-language.dto';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  findAll(): Promise<LanguageDto[]> {
    return this.languagesService.findAll();
  }

  @Get(':code')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  async findOne(@Param('code') code: string): Promise<LanguageDto> {
    return new LanguageDto(await this.languagesService.findOne(code));
  }

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  create(@Body() language: CreateLanguageDto): Promise<LanguageDto> {
    return this.languagesService.create(language);
  }

  @Put(':id')
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() language: UpdateLanguageDto,
  ): Promise<LanguageDto> {
    return this.languagesService.update(id, language);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.languagesService.delete(id);
  }
}
