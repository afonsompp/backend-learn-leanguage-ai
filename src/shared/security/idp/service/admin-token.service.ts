import { Injectable } from '@nestjs/common';
import { AuthApiConfigService } from '../config/auth-api.config.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AdminTokenService {
  private readonly auth0Audience: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;
  private readonly auth0Url: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AuthApiConfigService,
  ) {
    this.auth0Audience = this.configService.getAudience;
    this.auth0ClientId = this.configService.getClientId;
    this.auth0ClientSecret = this.configService.getClientSecret;
    this.auth0Url = this.configService.getUrl;
  }

  async getAccessToken(): Promise<string> {
    try {
      const response = await this.httpService
        .post(
          this.auth0Url + '/oauth/token',
          {
            client_id: this.auth0ClientId,
            client_secret: this.auth0ClientSecret,
            audience: this.auth0Audience,
            grant_type: 'client_credentials',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      return response.data.access_token;
    } catch (error) {
      console.error('Failed to obtain access token from Auth0:', error);
      throw error;
    }
  }
}
