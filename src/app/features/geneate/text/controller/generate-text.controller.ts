import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateTextService } from '../service/generate-text.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { Scopes } from '@core/security/scopes/scopes.decorator';

@Controller('text')
export class GenerateTextController {
  constructor(private readonly textService: GenerateTextService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  @Scopes('read:text', 'write:text')
  async create(@Body() generateTextDto: GenerateTextDto) {
    return {
      data: JSON.parse(await this.textService.create(generateTextDto)),
    };
  }
}
