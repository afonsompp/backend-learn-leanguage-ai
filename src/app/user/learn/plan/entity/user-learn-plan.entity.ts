import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

@Entity()
@Unique(['targetLanguage', 'level'])
export class UserLearnPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true, nullable: false })
  userId: string;
  @ManyToOne(() => Language)
  nativeLanguage: Language;

  @ManyToOne(() => Language)
  targetLanguage: Language;

  @Column({ type: 'enum', enum: LanguageLevel })
  level: LanguageLevel;
}
