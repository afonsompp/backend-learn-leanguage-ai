import { Injectable, Logger } from '@nestjs/common';
import {
  Sentence,
  SentenceWord,
} from '@app/features/story/generator/types/sentence.type';

@Injectable()
export class StoryTextPreProcessorService {
  private readonly logger = new Logger(StoryTextPreProcessorService.name);

  processText(text: string): SentenceWord[] {
    this.logger.log('Processing text');
    const sentences = this.breakTextIntoSentencesWithEndChar(text);
    const sentencesWord = this.breakSentencesIntoWords(sentences);
    this.logger.log('Text processed with success');

    return sentencesWord;
  }

  private breakTextIntoSentencesWithEndChar(text: string): Sentence[] {
    this.logger.log('Breaking text into sentences with end characters.');
    const sentencePattern = /([^.!?]+[.!?]+)/g;
    const matches = [...text.matchAll(sentencePattern)];

    return matches.map((match) => {
      const sentence = match[0].trim();
      const endChar = sentence.slice(-1);
      return { text: sentence, endChar };
    });
  }

  private breakSentencesIntoWords(sentences: Sentence[]): SentenceWord[] {
    this.logger.log('Processing sentences into words with end characters.');
    const wordPattern = /\b\w+('\w+)?\b/g;

    return sentences.map((sentence) => {
      const words = sentence.text.match(wordPattern) || [];
      return { words, endChar: sentence.endChar };
    });
  }
}
