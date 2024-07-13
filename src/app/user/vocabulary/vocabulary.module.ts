import { Module } from '@nestjs/common';
import { VocabularyController } from './controller/vocabulary.controller';
import { WordService } from './service/word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '@app/system/language/entities/language.entity';
import { UserProfile } from '@app/user/profile/entity/user-profile.entity';
import { LanguageModule } from '@app/system/language/language.module';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, Language]),
    LanguageModule,
    AuthorizationModule,
  ],
  controllers: [VocabularyController],
  providers: [WordService],
  exports: [WordService],
})
export class VocabularyModule {}
