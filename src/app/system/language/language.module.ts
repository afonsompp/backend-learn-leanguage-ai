import { Module } from '@nestjs/common';
import { LanguageController } from './controller/language.controller';
import { LanguageService } from './service/language.service';
import { Language } from './entities/language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), AuthorizationModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
