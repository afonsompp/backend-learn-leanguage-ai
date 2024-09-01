import { Injectable, Logger } from '@nestjs/common';
import {
  ProcessedText,
  SentenceWord,
} from '@app/features/story/generator/types/sentence.type';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { WordService } from '@app/user/vocabulary/service/word.service';

@Injectable()
export class StoryTextProcessorService {
  private readonly logger = new Logger(StoryTextProcessorService.name);

  constructor(private readonly wordService: WordService) {}
  async processStoryText(
    text: SentenceWord[],
    practice: Practice,
  ): Promise<ProcessedText> {
    const allWords = this.getAllWords(text);

    const processedWords = await this.wordService.processWords(
      allWords,
      practice.learnPlan.user.userId,
      practice.learnPlan.id,
    );

    return text.map((sentence) => {
      const words = sentence.words.map((word) =>
        processedWords.find((ratedWord) => ratedWord.word === word),
      );
      return { words: words, endChar: sentence.endChar };
    });
  }

  private getAllWords(sentencesWord: SentenceWord[]): string[] {
    this.logger.log('Extracting all words from processed sentences.');
    const words = sentencesWord.flatMap((sentenceWord) => sentenceWord.words);
    return Array.from(new Set(words));
  }
}
