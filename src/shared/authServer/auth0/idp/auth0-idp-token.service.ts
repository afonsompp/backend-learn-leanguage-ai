import { Injectable } from '@nestjs/common';
import { Auth0TokenService } from '../service/auth0-token.service';
import { HttpService } from '@nestjs/axios';
import { AuthApiConfigService } from '../config/auth-api.config.service';

@Injectable()
export class Auth0IdpTokenService {
  private readonly url: string;

  constructor(
    private readonly authAccessToken: Auth0TokenService,
    private readonly httpService: HttpService,
    private readonly configService: AuthApiConfigService,
  ) {
    this.url = configService.getUrl;
  }

  async getIdpToken(userId: string): Promise<IdpToken> {
    try {
      const response = await this.httpService
        .get(this.url + '/api/v2/users/' + userId, {
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
