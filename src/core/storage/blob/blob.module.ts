import { Module } from '@nestjs/common';
import { AwsConfigService } from '@config/aws.config.service';
import { S3Client } from '@aws-sdk/client-s3';
import { BlobService } from './service/blob.service';

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
    BlobService,
  ],
  exports: [S3Client],
})
export class BlobModule {}
