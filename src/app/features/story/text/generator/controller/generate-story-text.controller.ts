import { Controller } from '@nestjs/common';
import { GenerateStoryTextService } from '@app/features/story/text/generator/service/generate-story-text.service';

@Controller('story/practice/:practiceId/text')
export class GenerateStoryTextController {
  constructor(private readonly generateTextService: GenerateStoryTextService) {}
}
