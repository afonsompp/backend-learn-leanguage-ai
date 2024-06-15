import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './shared/aws/aws.module';
import { BedrockModule } from './shared/aws/bedrock/bedrock.module';
import { TextModule } from './geneate/text/text.module';
import { AuthModule } from './shared/auth/auth.module';
import { PromptModule } from './shared/prompt/prompt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
    AwsModule,
    BedrockModule,
    TextModule,
    AuthModule,
    PromptModule,
  ],
  providers: [AuthModule],
  exports: [],
})
export class AppModule {}
