import { Module } from '@nestjs/common';
import { OpenaiConfigService } from '@config/openai.config.service';
import { HttpClientModule } from '@core/client/http-client.module';
import { OpenaiTextClientService } from '@shared/ai/openai/text/service/openai-text-client.service';
import { OpenaiTextToSpeechService } from '@shared/ai/openai/audio/speech/service/openai-text-to-speech.service';

@Module({
  imports: [HttpClientModule],
  providers: [
    OpenaiTextClientService,
    OpenaiConfigService,
    OpenaiTextToSpeechService,
  ],
  exports: [OpenaiTextClientService, OpenaiTextToSpeechService],
})
export class AIModule {}
