import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './shared/aws/aws.module';
import { TextModule } from './geneate/text/text.module';
import { PromptModule } from './shared/prompt/prompt.module';
import { BedrockModule } from './shared/aws/bedrock/bedrock.module';
import { AuthModule } from './shared/security/auth/auth.module';
import { IdpModule } from './shared/security/idp/idp.module';

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
    IdpModule,
  ],
  exports: [],
})
export class AppModule {}
