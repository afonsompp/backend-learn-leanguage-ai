import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KnowledgeLevel } from '@app/user/vocabulary/entity/knowledge-level';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true, nullable: false })
  word: string;

  @Column({
    type: 'enum',
    enum: KnowledgeLevel,
    default: KnowledgeLevel.UNKNOWN,
  })
  level: KnowledgeLevel;

  @ManyToOne(() => PracticeContent)
  practiceContent: PracticeContent;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
