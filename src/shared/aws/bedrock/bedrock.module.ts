import { Module } from '@nestjs/common';
import { BedrockService } from './bedrock.service';
import { AwsModule } from '../aws.module';

@Module({
  imports: [AwsModule],
  providers: [BedrockService],
  exports: [BedrockService],
})
export class BedrockModule {}
