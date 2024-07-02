import { Module } from '@nestjs/common';
import { LanguagesController } from './controller/languages.controller';
import { LanguagesService } from './service/languages.service';
import { Language } from './entities/language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), AuthorizationModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
