import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

@Entity()
@Unique(['user', 'targetLanguage', 'level'])
export class UserLearnPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserProfile, (user) => user.userLearnPlans)
  user: UserProfile;

  @ManyToOne(() => Language)
  targetLanguage: Language;

  @Column({ type: 'enum', enum: LanguageLevel })
  level: LanguageLevel;
}
