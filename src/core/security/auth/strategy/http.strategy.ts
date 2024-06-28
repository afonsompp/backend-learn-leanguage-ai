import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../service/auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('HttpStrategy');

  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    token: string,
    done: (error: HttpException, value: boolean | string) => any,
  ) {
    try {
      const user = await this.authService.validateToken(token);
      return done(null, user);
    } catch (error) {
      return done(new UnauthorizedException('Invalid token'), false);
    }
  }
}
