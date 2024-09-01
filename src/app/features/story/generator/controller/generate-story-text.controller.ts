import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { StoryTextService } from '@app/features/story/generator/service/story-text.service';
import { ProcessedText } from '@app/features/story/generator/types/sentence.type';

@Controller('story')
@ApiBearerAuth()
export class GenerateStoryTextController {
  constructor(private readonly storyService: StoryTextService) {}

  @Post('text')
  async generateStoryText(
    @Body() generateStoryTextDto: GenerateStoryTextDto,
    @Req() req: UserRequest,
  ): Promise<ProcessedText> {
    const userId = req.user.sub;
    return this.storyService.createStory(generateStoryTextDto, userId);
  }
}
