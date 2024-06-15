import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AIOptions {
  @Expose({ name: 'model_id' })
  @IsString()
  modelId: string;
  @Expose({ name: 'temperature' })
  @IsNumber()
  temperature: number;
  @Expose({ name: 'top_p' })
  @IsNumber()
  topP: number;
  @Expose({ name: 'max_length' })
  @IsNumber()
  maxLength: number;
}
