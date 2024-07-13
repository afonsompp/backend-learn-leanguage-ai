import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '@app/user/vocabulary/entity/word.entity';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { AddWordDto } from '@app/user/vocabulary/dto/add-word.dto';
import { WordDto } from '@app/user/vocabulary/dto/word.dto';

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);

  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    private readonly practiceContentService: PracticeContentService,
  ) {}
  async create(addWordDto: AddWordDto, userId: string): Promise<WordDto> {
    const { word, level, practiceContentId } = addWordDto;

    this.logger.log(`Creating word: ${word}`);

    if (await this.wordRepository.findOne({ where: { word } })) {
      this.logger.warn(`word already exists: ${word}`);
      throw new ConflictException('Word already exists for this vocabulary');
    }

    const practiceContent = await this.practiceContentService.findOne(
      practiceContentId,
      userId,
    );

    const createdWord = this.wordRepository.create({
      word,
      level,
      practiceContent,
    });

    await this.wordRepository.save(createdWord);

    this.logger.log(`Created vocabulary for word: ${word}`);
    return new WordDto(createdWord);
  }
}
