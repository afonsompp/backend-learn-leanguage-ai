import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  get awsAccessKeyId(): string {
    return this.configService.get<string>('aws.accessKeyId');
  }

  get awsSecretAccessKey(): string {
    return this.configService.get<string>('aws.secretAccessKey');
  }

  get awsRegion(): string {
    return this.configService.get<string>('aws.region');
  }
}
