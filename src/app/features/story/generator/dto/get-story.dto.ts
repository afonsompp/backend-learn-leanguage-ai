import { IsUUID } from 'class-validator';

export class GetStoryDto {
  @IsUUID()
  id: string;
}
