import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from '@app/system/languages/entities/language.entity';

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
