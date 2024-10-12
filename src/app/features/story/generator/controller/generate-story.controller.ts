import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { StoryTextService } from '@app/features/story/generator/service/story-text.service';

@Controller('story')
@ApiBearerAuth()
export class GenerateStoryController {
  constructor(private readonly storyService: StoryTextService) {}

  @Post('text')
  async generateStoryText(
    @Body() generateStoryTextDto: GenerateStoryTextDto,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.sub;
    return this.storyService.createStory(generateStoryTextDto, userId);
  }
}
