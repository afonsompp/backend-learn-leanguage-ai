import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { Scopes } from '@core/security/scopes/scopes.decorator';
import { GenerateTextService } from '@app/features/geneate/text/service/generate-text.service';
import { GenerateTextDto } from '@app/features/geneate/text/dto/generate-text.dto';

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
