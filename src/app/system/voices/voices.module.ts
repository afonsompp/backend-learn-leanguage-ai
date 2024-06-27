import { Module } from '@nestjs/common';
import { VoicesController } from './controller/voices.controller';
import { VoicesService } from './service/voices.service';
import { Voice } from './entities/voice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voice, Language])],
  controllers: [VoicesController],
  providers: [VoicesService],
})
export class VoicesModule {}
