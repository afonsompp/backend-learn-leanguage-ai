import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { PutFileRequest } from '@core/storage/blob/interface/put-file-request';
import { AwsConfigService } from '@config/aws.config.service';

@Injectable()
export class BlobService {
  private readonly logger = new Logger(BlobService.name);

  constructor(
    private readonly s3Client: S3Client,
    private readonly config: AwsConfigService,
  ) {}

  async uploadObject(putFileRequest: PutFileRequest): Promise<void> {
    const { key, body } = putFileRequest;
    this.logger.log(`Uploading file to ${this.config.bucket}/${key}`);
    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.config.bucket,
          Key: key,
          Body: body,
        },
      });

      await upload.done();
      this.logger.log(`File uploaded to ${this.config.bucket}/${key}`);
    } catch (error) {
      this.logger.error(
        `Failed to upload file to ${this.config.bucket}/${key}`,
        error,
      );
      throw error;
    }
  }

  async getFileUrl(getObjectRequest: GetFileRequest): Promise<string> {
    const { key, urlExpiresIn } = getObjectRequest;

    this.logger.log(`Get url file from ${this.config.bucket}/${key}`);
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: urlExpiresIn,
      });

      this.logger.log(`Url get to ${this.config.bucket}/${key}`);

      return url;
    } catch (error) {
      this.logger.error(
        `Failed to get file url from ${this.config.bucket}/${key}`,
        error,
      );
      throw error;
    }
  }

  async objectExists(key: string): Promise<boolean> {
    this.logger.log(`Check if object: ${this.config.bucket}/${key} exists`);
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        }),
      );

      return true;
    } catch (error) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        this.logger.warn(`Object: ${this.config.bucket}/${key} NotFound`);
        return false;
      }
      this.logger.error(`Failed to check if object exists`);
      throw error;
    }
  }

  async deleteObject(key: string): Promise<boolean> {
    this.logger.log(`Check if object: ${this.config.bucket}/${key} exists`);

    if (await this.objectExists(key)) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.config.bucket,
            Key: key,
          }),
        );
        return true;
      } catch (error) {
        this.logger.error(`Failed to delete object`);
        throw error;
      }
    }
    return false;
  }
}
