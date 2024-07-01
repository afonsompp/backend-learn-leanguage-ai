import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeTypeController } from '@app/system/practice/controller/practice-type.controller';
import { PracticeTypeService } from '@app/system/practice/service/practice-type.service';
import { PracticeType } from '@app/system/practice/entities/practice-type.entity';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeType]), AuthorizationModule],
  controllers: [PracticeTypeController],
  providers: [PracticeTypeService],
  exports: [PracticeTypeService],
})
export class PracticeDefinitionModule {}
