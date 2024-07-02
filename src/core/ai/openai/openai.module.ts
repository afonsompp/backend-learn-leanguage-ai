import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenaiTextClientService } from '@core/ai/openai/text/service/openai-text-client.service';
import { OpenaiConfigService } from '@config/openai.config.service';

@Module({
  imports: [HttpModule],
  providers: [OpenaiTextClientService, OpenaiConfigService],
})
export class OpenaiModule {}
