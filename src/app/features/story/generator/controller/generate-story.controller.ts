import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GenerateStoryTextDto } from '@app/features/story/generator/dto/generate-story-text.dto';
import { StoryTextService } from '@app/features/story/generator/service/story-text.service';
import { StoryAudioService } from '@app/features/story/generator/service/story-audio.service';
import { GetStoryDto } from '@app/features/story/generator/dto/get-story.dto';

@Controller('story')
@ApiBearerAuth()
export class GenerateStoryController {
  constructor(
    private readonly storyTextService: StoryTextService,
    private readonly storyAudioService: StoryAudioService,
  ) {}

  @Post('text')
  async generateStoryText(
    @Body() generateStoryTextDto: GenerateStoryTextDto,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.sub;
    return this.storyTextService.createStory(generateStoryTextDto, userId);
  }
  @Get('text/:id')
  async getStoryText(@Req() req: UserRequest, @Param() params: GetStoryDto) {
    const userId = req.user.sub;
    return this.storyTextService.getStory(params.id, userId);
  }

  @Get('audio/:id')
  async getStoryAudio(@Req() req: UserRequest, @Param() params: GetStoryDto) {
    const userId = req.user.sub;
    return this.storyAudioService.getStoryAudio(params.id, userId);
  }
}
