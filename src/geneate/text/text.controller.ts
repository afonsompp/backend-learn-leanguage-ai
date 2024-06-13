import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from '../../shared/auth/scopes/scopes.decorator';
import { ScopesGuard } from '../../shared/auth/scopes/scopes.guard';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'), ScopesGuard)
  @Scopes('read:text', 'write:text')
  async create(@Body() createTextDto: CreateTextDto) {
    return { response: await this.textService.create(createTextDto) };
  }
}
