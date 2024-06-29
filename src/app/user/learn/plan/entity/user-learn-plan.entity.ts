import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { UserProfile } from '@app/user/profiles/entity/user-profile.entity';
import { LanguageLevel } from '@app/user/learn/plan/entity/language-level';

@Entity()
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
