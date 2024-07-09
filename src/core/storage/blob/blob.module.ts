import { Module } from '@nestjs/common';
import { AwsConfigService } from '@config/aws.config.service';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [
    AwsConfigService,
    {
      provide: S3Client,
      useFactory: (configService: AwsConfigService) => {
        return new S3Client({
          region: configService.region,
          credentials: {
            accessKeyId: configService.accessKeyId,
            secretAccessKey: configService.secretAccessKey,
          },
        });
      },
      inject: [AwsConfigService],
    },
  ],
  exports: [S3Client],
})
export class BlobModule {}
