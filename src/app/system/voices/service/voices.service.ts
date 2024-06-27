import { Injectable } from '@nestjs/common';
import { Voice } from '../entities/voice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '../../languages/entities/language.entity';
import { VoiceDto } from '../dto/voice.dto';
import { CreateVoiceDto } from '../dto/create-voice.dto';
import { UpdateVoiceDto } from '../dto/update-voice.dto';

@Injectable()
export class VoicesService {
  constructor(
    @InjectRepository(Voice)
    private voicesRepository: Repository<Voice>,
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  async findAll(): Promise<VoiceDto[]> {
    const voices = await this.voicesRepository.find({
      relations: ['language'],
    });
    return voices.map((voice) => new VoiceDto(voice));
  }

  async findOne(name: string): Promise<VoiceDto> {
    const voice = await this.voicesRepository.findOne({
      where: { name },
      relations: ['language'],
    });
    return new VoiceDto(voice);
  }

  async create(createVoiceDto: CreateVoiceDto): Promise<VoiceDto> {
    const language = await this.languagesRepository.findOne({
      where: { code: createVoiceDto.languageCode },
    });
    const voice = this.voicesRepository.create({ ...createVoiceDto, language });
    await this.voicesRepository.save(voice);
    return new VoiceDto(voice);
  }

  async update(id: number, updateVoiceDto: UpdateVoiceDto): Promise<VoiceDto> {
    if (updateVoiceDto.languageCode) {
      const language = await this.languagesRepository.findOne({
        where: { code: updateVoiceDto.languageCode },
      });
      await this.voicesRepository.update(id, { ...updateVoiceDto, language });
    } else {
      await this.voicesRepository.update(id, updateVoiceDto);
    }
    const updatedVoice = await this.voicesRepository.findOne({
      where: { id },
      relations: ['language'],
    });
    return new VoiceDto(updatedVoice);
  }

  async delete(id: number): Promise<void> {
    await this.voicesRepository.delete(id);
  }
}
