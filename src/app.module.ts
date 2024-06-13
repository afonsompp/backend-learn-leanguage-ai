import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './shared/aws/aws.module';
import { BedrockModule } from './shared/aws/bedrock/bedrock.module';
import { TextModule } from './geneate/text/text.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
    AwsModule,
    BedrockModule,
    TextModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
