import { Injectable, NotFoundException } from '@nestjs/common';
import { VoiceDto } from '../dto/voice.dto';
import { UpdateVoiceDto } from '../dto/update-voice.dto';
import { Voice } from '../entities/voice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '../../languages/entities/language.entity';
import { CreateVoiceDto } from '../dto/create-voice.dto';

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
    if (!voice) {
      throw new NotFoundException(`Voice with name ${name} not found`);
    }
    return new VoiceDto(voice);
  }

  async create(createVoiceDto: CreateVoiceDto): Promise<VoiceDto> {
    const { languageCode, ...voiceData } = createVoiceDto;

    const language = await this.languagesRepository.findOne({
      where: { code: languageCode },
    });

    if (!language) {
      throw new NotFoundException(
        `Language with code ${languageCode} not found`,
      );
    }

    const voice = this.voicesRepository.create({
      ...voiceData,
      language,
    });

    await this.voicesRepository.save(voice);

    return new VoiceDto(voice);
  }

  async update(id: number, updateVoiceDto: UpdateVoiceDto): Promise<VoiceDto> {
    const { languageCode, ...voiceData } = updateVoiceDto;

    const voice = await this.voicesRepository.findOneBy({ id });

    if (!voice) {
      throw new NotFoundException(`Voice with id ${id} not found`);
    }

    if (languageCode) {
      const language = await this.languagesRepository.findOne({
        where: { code: languageCode },
      });

      if (!language) {
        throw new NotFoundException(
          `Language with code ${languageCode} not found`,
        );
      }

      voice.language = language;
    }

    await this.voicesRepository.update(voice, voiceData);
    const updatedVoice = await this.voicesRepository.findOneBy({ id });

    return new VoiceDto(updatedVoice);
  }

  async delete(id: number): Promise<void> {
    const result = await this.voicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Voice with id ${id} not found`);
    }
  }
}
