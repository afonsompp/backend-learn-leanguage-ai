import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.get<string[]>(
      'scopes',
      context.getHandler(),
    );
    if (!requiredScopes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasScope = () =>
      user &&
      user.scope &&
      requiredScopes.every((scope) => user.scope.includes(scope));
    if (!hasScope()) {
      throw new ForbiddenException('You do not have the required scopes');
    }
    return true;
  }
}
