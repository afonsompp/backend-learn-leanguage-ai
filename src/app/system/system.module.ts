import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { VoicesModule } from './voices/voices.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    LanguagesModule,
    VoicesModule,
    RouterModule.register([
      {
        path: 'system',
        module: LanguagesModule,
      },
      {
        path: 'system',
        module: VoicesModule,
      },
    ]),
  ],
})
export class SystemModule {}
