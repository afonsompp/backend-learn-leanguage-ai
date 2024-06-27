import * as jwt from 'jsonwebtoken';

export class JwtUtils {
  static getSub(token: string): string {
    return jwt.decode(token, { complete: true }).payload.sub.toString();
  }
}
