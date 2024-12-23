import { Module } from '@nestjs/common';
import { VocabularyController } from './controller/vocabulary.controller';
import { WordService } from './service/word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { Word } from '@app/user/vocabulary/entity/word.entity';
import { LearnPlanModule } from '@app/user/learn/plan/learn-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
    LearnPlanModule,
    AuthorizationModule,
  ],
  controllers: [VocabularyController],
  providers: [WordService],
  exports: [WordService],
})
export class VocabularyModule {}
