import { Request } from 'express';
import { JwtClaims } from '@okta/jwt-verifier';

export interface UserRequest extends Request {
  user?: JwtClaims;
}
