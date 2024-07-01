import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { VoicesModule } from './voices/voices.module';
import { RouterModule } from '@nestjs/core';
import { PracticeDefinitionModule } from '@app/system/practice/practice-definition.module';

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
      {
        path: 'system',
        module: PracticeDefinitionModule,
      },
    ]),
  ],
})
export class SystemModule {}
