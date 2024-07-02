import { Module } from '@nestjs/common';
import { GenerateAudioController } from './controller/generate-audio.controller';
import { AudioService } from './service/audio.service';
import { AudioController } from './controller/audio.controller';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [AuthorizationModule],
  controllers: [GenerateAudioController, AudioController],
  providers: [AudioService],
})
export class AudioModule {}
