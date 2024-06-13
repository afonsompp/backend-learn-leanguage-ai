import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  get clientId(): string {
    return this.configService.get<string>('okta.clientId');
  }

  get issuer(): string {
    return this.configService.get<string>('okta.issuer');
  }

  get audience(): string {
    return this.configService.get<string>('okta.audience');
  }
}
