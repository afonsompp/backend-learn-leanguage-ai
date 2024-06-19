import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TextService } from '../service/text.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '../../../shared/security/auth/service/scopes/scopes.guard';
import { Scopes } from '../../../shared/security/auth/service/scopes/scopes.decorator';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  @Scopes('read:text', 'write:text')
  async create(@Body() generateTextDto: GenerateTextDto) {
    return {
      data: JSON.parse(await this.textService.create(generateTextDto)),
    };
  }
}
