import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WordService } from '@app/user/vocabulary/service/word.service';

@Controller('profiles')
@ApiBearerAuth()
export class VocabularyController {
  constructor(private readonly wordService: WordService) {}
}
