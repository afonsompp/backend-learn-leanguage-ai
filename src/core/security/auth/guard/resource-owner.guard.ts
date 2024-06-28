import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { sub } = request.user;
    const { id } = request.body;

    if (!id || sub !== id) {
      throw new UnauthorizedException('you not are owner of this resource');
    }

    return true;
  }
}
