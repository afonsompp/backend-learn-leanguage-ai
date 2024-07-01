import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguagesService } from '@app/system/languages/service/languages.service';
import { UpdateVoiceDto } from '@app/system/voices/dto/update-voice.dto';
import { VoiceDto } from '@app/system/voices/dto/voice.dto';
import { Voice } from '@app/system/voices/entities/voice.entity';
import { Language } from '@app/system/languages/entities/language.entity';
import { CreateVoiceDto } from '@app/system/voices/dto/create-voice.dto';

@Injectable()
export class VoicesService {
  constructor(
    @InjectRepository(Voice)
    private voicesRepository: Repository<Voice>,
    @InjectRepository(Language)
    private languagesService: LanguagesService,
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

    if (await this.voicesRepository.existsBy({ name: voiceData.name })) {
      throw new ConflictException(
        `Voice with name ${voiceData.name} already exists`,
      );
    }
    const language = await this.languagesService.findOne(languageCode);

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
    voice.language = await this.languagesService.findOne(languageCode);

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
