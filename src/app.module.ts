import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './shared/aws/aws.module';
import { BedrockModule } from './shared/aws/bedrock/bedrock.module';
import { TextModule } from './geneate/text/text.module';
import { AuthModule } from './shared/auth/auth.module';
import { PromptModule } from './shared/prompt/prompt.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // path to the static files directory
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
    AwsModule,
    BedrockModule,
    TextModule,
    AuthModule,
    PromptModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
