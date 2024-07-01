import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PromptTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @Column('text', { nullable: false })
  instruction: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false })
  temperature: number;

  @Column({ nullable: false })
  topP: number;

  @Column({ nullable: false })
  stream: boolean;
}
