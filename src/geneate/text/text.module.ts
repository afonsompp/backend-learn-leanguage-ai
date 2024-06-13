import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';
import { BedrockModule } from '../../shared/aws/bedrock/bedrock.module';

@Module({
  imports: [BedrockModule],
  controllers: [TextController],
  providers: [TextService],
})
export class TextModule {}
