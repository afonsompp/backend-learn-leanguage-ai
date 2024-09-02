import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WordService } from '@app/user/vocabulary/service/word.service';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { UpdateWordDto } from '@app/user/vocabulary/dto/update-word.dto';
import { CreateWordDto } from '@app/user/vocabulary/dto/create-word.dto';

@Controller('vocabulary')
@ApiBearerAuth()
export class VocabularyController {
  constructor(private readonly wordService: WordService) {}

  @Post('words')
  @HttpCode(201)
  create(@Req() req: UserRequest, @Body() wordDto: CreateWordDto) {
    return this.wordService.create(
      wordDto.word,
      wordDto.learnPlanId,
      req.user.sub,
    );
  }
  @Patch(':id')
  @HttpCode(200)
  update(
    @Req() req: UserRequest,
    @Param('id') wordId,
    @Body() wordDto: UpdateWordDto,
  ) {
    return this.wordService.update(
      wordId,
      wordDto.rating,
      wordDto.learnPlanId,
      req.user.sub,
    );
  }
}
