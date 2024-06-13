import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import awsConfig from './config/aws.config';
import { AwsConfigService } from './config/aws.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
  ],
  providers: [
    AwsConfigService,
    {
      provide: S3Client,
      useFactory: (configService: AwsConfigService) => {
        return new S3Client({
          region: configService.awsRegion,
          credentials: {
            accessKeyId: configService.awsAccessKeyId,
            secretAccessKey: configService.awsSecretAccessKey,
          },
        });
      },
      inject: [AwsConfigService],
    },
    {
      provide: BedrockRuntimeClient,
      useFactory: (configService: AwsConfigService) => {
        return new BedrockRuntimeClient({
          region: configService.awsRegion,
          credentials: {
            accessKeyId: configService.awsAccessKeyId,
            secretAccessKey: configService.awsSecretAccessKey,
          },
        });
      },
      inject: [AwsConfigService],
    },
  ],
  exports: [S3Client, BedrockRuntimeClient],
})
export class AwsModule {}
