import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthConfigService {
  constructor(private configService: ConfigService) {}

  get issuer(): string {
    return this.configService.get<string>('oauth.issuer');
  }

  get audience(): string {
    return this.configService.get<string>('oauth.audience');
  }

  get adminClientId(): string {
    return this.configService.get<string>('oauth.admin.clientId');
  }

  get adminClientSecret(): string {
    return this.configService.get<string>('oauth.admin.clientSecret');
  }

  get adminAudience(): string {
    const issuer = this.configService.get<string>('oauth.issuer');
    return `${issuer}/api/v2/`;
  }
}
