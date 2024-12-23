import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { KnowledgeRating } from '@app/user/vocabulary/entity/knowledge-rating';
import { UserLearnPlan } from '@app/user/learn/plan/entity/user-learn-plan.entity';

@Entity()
@Unique(['word', 'learnPlan'])
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: false })
  word: string;

  @Column({
    type: 'enum',
    enum: KnowledgeRating,
    default: KnowledgeRating.UNKNOWN,
  })
  rating: KnowledgeRating;

  @ManyToOne(() => UserLearnPlan)
  learnPlan: UserLearnPlan;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
