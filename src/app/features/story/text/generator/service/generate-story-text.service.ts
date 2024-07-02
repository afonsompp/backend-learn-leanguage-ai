import { Injectable } from '@nestjs/common';
import { GenerateStoryTextDto } from '@app/features/story/text/generator/dto/generate-story-text.dto';

@Injectable()
export class GenerateStoryTextService {
  async create(request: GenerateStoryTextDto): Promise<string> {
    return request.theme;
  }
}
