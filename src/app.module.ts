import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './shared/aws/aws.module';
import { TextModule } from './geneate/text/text.module';
import { AuthModule } from './shared/auth/auth.module';
import { PromptModule } from './shared/prompt/prompt.module';
import { BedrockModule } from './shared/aws/bedrock/bedrock.module';
import { Auth0Module } from './shared/authServer/auth0/auth0.module';

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
    Auth0Module,
  ],
  providers: [AuthModule],
  exports: [],
})
export class AppModule {}
