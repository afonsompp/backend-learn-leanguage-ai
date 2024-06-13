import { Injectable } from '@nestjs/common';
import { BedrockService } from '../../shared/aws/bedrock/bedrock.service';
import { CreateTextDto } from './dto/create-text.dto';

@Injectable()
export class TextService {
  constructor(private readonly bedrockService: BedrockService) {}

  async create(request: CreateTextDto): Promise<string> {
    return await this.bedrockService.converse(request.text);
  }
}
