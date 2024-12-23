import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StoryService } from '@app/features/story/service/story.service';
import { GenerateStoryTextDto } from '@app/features/story/dto/generate-story-text.dto';
import { GetStoryDto } from '@app/features/story/dto/get-story.dto';

@Controller('story')
@ApiBearerAuth()
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post('/text')
  async generateStoryText(
    @Body() generateStoryTextDto: GenerateStoryTextDto,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.sub;
    return this.storyService.createStory(generateStoryTextDto, userId);
  }
  @Get('text/:id')
  async getStoryText(@Req() req: UserRequest, @Param() params: GetStoryDto) {
    const userId = req.user.sub;
    return this.storyService.getStory(params.id, userId);
  }

  @Get('audio/:id')
  async getStoryAudio(@Req() req: UserRequest, @Param() params: GetStoryDto) {
    const userId = req.user.sub;
    return this.storyService.getStoryAudio(params.id, userId);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteStoryAudio(
    @Req() req: UserRequest,
    @Param() params: GetStoryDto,
  ) {
    const userId = req.user.sub;
    await this.storyService.deleteStory(params.id, userId);
  }
}
