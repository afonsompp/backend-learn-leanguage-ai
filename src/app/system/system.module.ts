import { Module } from '@nestjs/common';
import { LanguagesModule } from './languages/languages.module';
import { RouterModule } from '@nestjs/core';
import { PracticeDefinitionModule } from '@app/system/practice/practice-definition.module';

@Module({
  imports: [
    LanguagesModule,
    RouterModule.register([
      {
        path: 'system',
        children: [
          {
            path: '',
            module: LanguagesModule,
          },
          {
            path: '',
            module: PracticeDefinitionModule,
          },
        ],
      },
    ]),
  ],
})
export class SystemModule {}
