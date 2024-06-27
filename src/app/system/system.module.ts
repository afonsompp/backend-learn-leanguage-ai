import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { VoicesModule } from './voices/voices.module';

@Module({
  imports: [LanguagesModule, VoicesModule],
})
export class SystemModule {}
