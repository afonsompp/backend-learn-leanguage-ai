import { Body, Controller, Post } from '@nestjs/common';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';

@Controller('text')
export class TextController {
  constructor(private readonly textService: TextService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(@Body() createTextDto: CreateTextDto) {
    return { response: await this.textService.create(createTextDto) };
  }
}
