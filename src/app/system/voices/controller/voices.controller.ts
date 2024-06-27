import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VoicesService } from '../service/voices.service';
import { VoiceDto } from '../dto/voice.dto';
import { CreateVoiceDto } from '../dto/create-voice.dto';

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

  @Put(':id')
  update(@Param('id') id: number, @Body() voice: VoiceDto): Promise<VoiceDto> {
    return this.voicesService.update(id, voice);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.voicesService.delete(id);
  }
}
