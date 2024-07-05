import { Module } from '@nestjs/common';
import { LanguageModule } from './language/language.module';
import { RouterModule } from '@nestjs/core';
import { PracticeDefinitionModule } from '@app/system/practice/practice-definition.module';

@Module({
  imports: [
    LanguageModule,
    RouterModule.register([
      {
        path: 'system',
        module: LanguageModule,
      },
      {
        path: 'system',
        module: PracticeDefinitionModule,
      },
    ]),
  ],
})
export class SystemModule {}
