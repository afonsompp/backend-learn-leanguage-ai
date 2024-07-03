import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGuard extends AuthGuard('bearer') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
