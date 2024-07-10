import { Body, Controller, Post, Req } from '@nestjs/common';
import { GenerateStoryTextService } from '@app/features/story/text/generator/service/generate-story-text.service';
import { GenerateStoryTextDto } from '@app/features/story/text/generator/dto/generate-story-text.dto';
import { UserRequest } from '@core/security/auth/entity/user-request.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('text')
@ApiBearerAuth()
export class GenerateStoryTextController {
  constructor(private readonly generateTextService: GenerateStoryTextService) {}

  @Post()
  async generateStoryText(
    @Body() generateStoryTextDto: GenerateStoryTextDto,
    @Req() req: UserRequest,
  ): Promise<string> {
    const userId = req.user.sub;
    return this.generateTextService.create(generateStoryTextDto, userId);
  }
}
