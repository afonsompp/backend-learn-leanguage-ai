import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Practice } from '@app/user/practice/entities/practice.entity';

@Entity()
export class PracticeContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  input: string;

  @Column('jsonb', { nullable: true })
  output: object;

  @Column({ nullable: true })
  totalTokens: number;

  @ManyToOne(() => Practice, (practice) => practice.contentHistory)
  practice: Practice;

  @CreateDateColumn()
  createdAt: Date;
}
