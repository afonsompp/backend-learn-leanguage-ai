import { Module } from '@nestjs/common';
import { TextService } from './service/text.service';
import { TextController } from './controller/text.controller';
import { BedrockModule } from '../../shared/aws/bedrock/bedrock.module';
import { AuthModule } from '../../shared/auth/auth.module';
import { PromptModule } from '../../shared/prompt/prompt.module';

@Module({
  imports: [BedrockModule, AuthModule, PromptModule],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
