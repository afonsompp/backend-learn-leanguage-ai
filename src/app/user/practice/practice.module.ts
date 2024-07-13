import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeDefinitionModule } from '@app/system/practice/practice-definition.module';
import { PracticeController } from '@app/user/practice/controller/practice.controller';
import { PracticeService } from '@app/user/practice/service/practice.service';
import { Practice } from '@app/user/practice/entities/practice.entity';
import { PracticeContent } from '@app/user/practice/entities/practice-content.entity';
import { AuthorizationModule } from '@core/security/auth/authorization.module';
import { PracticeContentService } from '@app/user/practice/service/practice-content.service';
import { LearnPlanModule } from '@app/user/learn/plan/learn-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Practice, PracticeContent]),
    LearnPlanModule,
    PracticeDefinitionModule,
    AuthorizationModule,
  ],
  controllers: [PracticeController],
  providers: [PracticeService, PracticeContentService],
  exports: [PracticeService, PracticeContentService],
})
export class PracticeModule {}
