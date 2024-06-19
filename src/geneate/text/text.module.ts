import { Module } from '@nestjs/common';
import { TextService } from './service/text.service';
import { TextController } from './controller/text.controller';
import { BedrockModule } from '../../shared/aws/bedrock/bedrock.module';
import { PromptModule } from '../../shared/prompt/prompt.module';
import { IdpModule } from '../../shared/security/idp/idp.module';
import { AuthModule } from '../../shared/security/auth/auth.module';

@Module({
  imports: [BedrockModule, AuthModule, PromptModule, IdpModule],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
