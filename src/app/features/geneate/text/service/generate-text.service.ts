import { Injectable } from '@nestjs/common';
import { GenerateTextDto } from '../dto/generate-text.dto';

@Injectable()
export class GenerateTextService {
  async create(request: GenerateTextDto): Promise<string> {
    return request.textDescription;
  }
}
