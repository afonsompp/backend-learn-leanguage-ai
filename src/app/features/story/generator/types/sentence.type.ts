import { WordDto } from '@app/user/vocabulary/dto/word.dto';

export type Sentence = { text: string; endChar: string };
export type SentenceWord = { words: string[]; endChar: string };
export type ProcessedText = {
  words: WordDto[];
  endChar: string;
}[];
