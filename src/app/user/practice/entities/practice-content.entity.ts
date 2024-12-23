import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';

@Entity()
export class PracticeContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  input: string;

  @Column('jsonb', { nullable: true })
  output: Record<string, any>;

  @Column({ nullable: true })
  totalTokens: number;

  @ManyToOne(() => UserLearnPlan)
  learnPlan: UserLearnPlan;

  @Column({ default: 'IN_PROGRESS' })
  audioEventStatus: string;

  @CreateDateColumn()
  createdAt: Date;
}
