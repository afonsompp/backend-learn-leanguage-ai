import * as OktaJwtVerifier from '@okta/jwt-verifier';
import { Injectable } from '@nestjs/common';
import { AuthConfigService } from '../config/auth.config.service';

@Injectable()
export class AuthService {
  private oktaVerifier: any;
  private readonly audience: string;

  constructor(private readonly config: AuthConfigService) {
    this.oktaVerifier = new OktaJwtVerifier({
      issuer: config.issuer,
      jwksUri: config.issuer + '.well-known/jwks.json',
    });

    this.audience = config.audience;
  }

  async validateToken(token: string): Promise<any> {
    const jwt = await this.oktaVerifier.verifyAccessToken(token, this.audience);
    return jwt.claims;
  }
}
