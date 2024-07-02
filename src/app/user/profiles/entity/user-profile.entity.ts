import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from '@app/system/languages/entities/language.entity';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true, nullable: false })
  userId: string;

  @ManyToOne(() => Language)
  nativeLanguage: Language;

  @OneToMany(() => UserLearnPlan, (userLearnPlan) => userLearnPlan.user)
  userLearnPlans: UserLearnPlan[];
}
