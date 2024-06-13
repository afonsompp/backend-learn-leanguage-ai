import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { BedrockModule } from '../../shared/aws/bedrock/bedrock.module';
import { AuthModule } from '../../shared/auth/auth.module';

@Module({
  imports: [BedrockModule, AuthModule],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
