import { Language } from '../../languages/entities/language.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Voice {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  gender: string;

  @ManyToOne(() => Language)
  language: Language;
}
