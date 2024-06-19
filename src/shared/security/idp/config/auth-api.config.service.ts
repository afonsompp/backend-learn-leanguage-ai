import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthApiConfigService {
  constructor(private configService: ConfigService) {}

  get getClientId(): string {
    return this.configService.get<string>('authApi.clientId');
  }

  get getClientSecret(): string {
    return this.configService.get<string>('authApi.clientSecret');
  }

  get getAudience(): string {
    return this.configService.get<string>('authApi.audience');
  }

  get getUrl(): string {
    return this.configService.get<string>('authApi.url');
  }
}
