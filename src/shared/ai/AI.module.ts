import { Module } from '@nestjs/common';
import { OpenaiConfigService } from '@config/openai.config.service';
import { HttpClientModule } from '@core/client/http-client.module';
import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';

@Module({
  imports: [HttpClientModule],
  providers: [OpenaiTextClientService, OpenaiConfigService],
  exports: [OpenaiTextClientService],
})
export class AIModule {}
