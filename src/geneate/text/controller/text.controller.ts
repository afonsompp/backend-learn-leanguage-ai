import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { TextService } from '../service/text.service';
import { GenerateTextDto } from '../dto/generate-text.dto';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from '../../../shared/auth/service/scopes/scopes.decorator';
import { ScopesGuard } from '../../../shared/auth/service/scopes/scopes.guard';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  @Scopes('read:text', 'write:text')
  async create(
    @Body() generateTextDto: GenerateTextDto,
    @Headers('authorization') accessToken: string,
  ) {
    return await this.textService.create(generateTextDto, accessToken);
  }
}
