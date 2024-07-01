import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VoicesService } from '@app/system/voices/service/voices.service';
import { VoiceDto } from '@app/system/voices/dto/voice.dto';
import { CreateVoiceDto } from '@app/system/voices/dto/create-voice.dto';
import { UpdateVoiceDto } from '@app/system/voices/dto/update-voice.dto';

@Controller('voices')
export class VoicesController {
  constructor(private readonly voicesService: VoicesService) {}

  @Get()
  findAll(): Promise<VoiceDto[]> {
    return this.voicesService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string): Promise<VoiceDto> {
    return this.voicesService.findOne(name);
  }

  @Post()
  create(@Body() voice: CreateVoiceDto): Promise<VoiceDto> {
    return this.voicesService.create(voice);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() voice: UpdateVoiceDto,
  ): Promise<VoiceDto> {
    return this.voicesService.update(id, voice);
  }

  @Delete(':id')
  delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    return this.voicesService.delete(id);
  }
}
