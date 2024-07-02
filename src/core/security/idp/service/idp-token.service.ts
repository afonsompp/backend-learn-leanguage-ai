import { Injectable } from '@nestjs/common';
import { AdminTokenService } from './admin-token.service';
import { HttpService } from '@nestjs/axios';
import { OAuthConfigService } from '@config/oauth.config.service';

@Injectable()
export class IdpTokenService {
  private readonly url: string;

  constructor(
    private readonly authAccessToken: AdminTokenService,
    private readonly httpService: HttpService,
    private readonly configService: OAuthConfigService,
  ) {
    this.url = configService.issuer;
  }

  async getIdpToken(userId: string): Promise<IdpToken> {
    try {
      const response = await this.httpService
        .get(this.url + 'api/v2/users/' + userId, {
          headers: {
            Authorization:
              'Bearer ' + (await this.authAccessToken.getAccessToken()),
          },
        })
        .toPromise();

      return {
        accessToken: response.data.identities[0].access_token,
        refreshToken: response.data.identities[0].refresh_token,
      };
    } catch (error) {
      console.error('Failed to obtain idp token:', error);
      throw error;
    }
  }
}
