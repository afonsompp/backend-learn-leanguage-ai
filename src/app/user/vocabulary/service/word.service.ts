import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Word } from '@app/user/vocabulary/entity/word.entity';
import { WordDto } from '@app/user/vocabulary/dto/word.dto';
import { KnowledgeRating } from '@app/user/vocabulary/entity/knowledge-rating';
import { LearnPlanService } from '@app/user/learn/plan/service/user-learn-plan.service';

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);

  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
    private readonly learnPlanService: LearnPlanService,
  ) {}
  async create(
    word: string,
    userId: string,
    learnPlanId: string,
  ): Promise<WordDto> {
    this.logger.log(`Creating word: ${word}`);
    const learnPlan = await this.learnPlanService.findOne(learnPlanId, userId);

    const existentWord = await this.wordRepository.findOne({
      where: { word: word, learnPlan: learnPlan },
    });
    if (existentWord) {
      this.logger.warn(`word already exists: ${word}`);
      throw new ConflictException('Word already exists for this vocabulary');
    }

    const createdWord = this.wordRepository.create({
      word,
      learnPlan,
    });

    await this.wordRepository.save(createdWord);

    this.logger.log(`word: ${word} added into vocabulary`);
    return new WordDto(createdWord);
  }

  async update(
    wordId: string,
    rating: KnowledgeRating,
    userId: string,
    learnPlanId: string,
  ): Promise<WordDto> {
    this.logger.log(`Updating rating tp word id: ${wordId}`);

    const learnPlan = await this.learnPlanService.findOne(learnPlanId, userId);

    const existentWord = await this.wordRepository.findOne({
      where: { id: wordId, learnPlan: learnPlan },
    });

    existentWord.rating = rating;

    await this.wordRepository.save(existentWord);

    this.logger.log(`rating to: ${existentWord.word} updated into vocabulary`);
    return new WordDto(existentWord);
  }

  async findUserVocabulary(
    userId: string,
    learnPlanId: string,
  ): Promise<WordDto[]> {
    const wordEntities = await this.wordRepository.find({
      where: {
        learnPlan: { id: learnPlanId },
      },
      relations: ['learnPlan'],
    });

    return wordEntities.map((word) => new WordDto(word));
  }

  async processWords(
    words: string[],
    userId: string,
    learnPlanId: string,
    defaultRating: KnowledgeRating = KnowledgeRating.UNKNOWN,
  ): Promise<WordDto[]> {
    const learnPlan = await this.learnPlanService.findOne(learnPlanId, userId);

    const uniqueWords = Array.from(new Set(words));

    const foundWordsEntities = await this.wordRepository.find({
      where: {
        word: In(uniqueWords),
        learnPlan: { id: learnPlanId },
      },
      relations: ['learnPlan'],
    });

    const existingWords = new Set(foundWordsEntities.map((word) => word.word));
    const newWords = uniqueWords.filter((word) => !existingWords.has(word));

    const newWordEntities = newWords.map((word) =>
      this.wordRepository.create({
        word,
        rating: defaultRating,
        learnPlan,
      }),
    );

    await this.wordRepository.save(newWordEntities);

    const allWords = [...foundWordsEntities, ...newWordEntities];
    return allWords.map((word) => new WordDto(word));
  }
}
