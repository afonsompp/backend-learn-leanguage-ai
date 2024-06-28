import { Module } from '@nestjs/common';
import { GenerateTextService } from './service/generate-text.service';
import { GenerateTextController } from './controller/generate-text.controller';
import { AuthorizationModule } from '@core/security/auth/authorization.module';

@Module({
  imports: [AuthorizationModule],
  controllers: [GenerateTextController],
  providers: [GenerateTextService],
})
export class TextModule {}
