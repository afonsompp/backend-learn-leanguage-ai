import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';

@Entity()
export class Practice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PracticeType, { nullable: false })
  @JoinColumn()
  practiceType: PracticeType;

  @ManyToOne(() => UserLearnPlan, { nullable: false })
  @JoinColumn()
  learnPlan: UserLearnPlan;

  @OneToMany(
    () => PracticeContent,
    (contentHistory) => contentHistory.practice,
    { cascade: true },
  )
  contentHistory: PracticeContent[];
  @CreateDateColumn()
  createdAt: Date;
}
