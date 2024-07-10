import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '@core/security/auth/service/auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    try {
      return await this.authService.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
