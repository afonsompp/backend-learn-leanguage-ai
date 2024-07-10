import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'typeorm/browser/platform/BrowserPlatformTools';
import { StreamingBlobPayloadInputTypes } from '@smithy/types/dist-types/streaming-payload/streaming-blob-payload-input-types';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class BlobService {
  private readonly logger = new Logger(BlobService.name);

  constructor(private readonly s3Client: S3Client) {}

  async uploadFile(
    bucket: string,
    key: string,
    body: string | Uint8Array | Buffer | Readable,
    urlExpiresIn: number,
  ): Promise<string> {
    this.logger.log(`Uploading file to ${bucket}/${key}`);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body as StreamingBlobPayloadInputTypes,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: urlExpiresIn,
      });
      this.logger.log(`File uploaded to ${bucket}/${key}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to upload file to ${bucket}/${key}`, error);
      throw error;
    }
  }

  async getFileUrl(
    bucket: string,
    key: string,
    urlExpiresIn: number,
  ): Promise<string> {
    this.logger.log(`Get url file from ${bucket}/${key}`);
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: urlExpiresIn,
      });

      this.logger.log(`Url get to ${bucket}/${key}`);

      return url;
    } catch (error) {
      this.logger.error(`Failed to get file url from ${bucket}/${key}`, error);
      throw error;
    }
  }
}
