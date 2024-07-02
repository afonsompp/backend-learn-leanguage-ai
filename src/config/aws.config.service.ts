import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  get accessKeyId(): string {
    return this.configService.get<string>('aws.accessKeyId');
  }

  get secretAccessKey(): string {
    return this.configService.get<string>('aws.secretAccessKey');
  }

  get region(): string {
    return this.configService.get<string>('aws.region');
  }
}
