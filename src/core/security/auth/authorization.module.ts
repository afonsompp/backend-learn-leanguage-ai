import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { OAuthConfigService } from '../../../config/oauth.config.service';
import { HttpStrategy } from './strategy/http.strategy';
import { ScopesGuard } from '../scopes/scopes.guard';

@Module({
  imports: [PassportModule],
  providers: [HttpStrategy, AuthService, OAuthConfigService, ScopesGuard],
  exports: [AuthService],
})
export class AuthorizationModule {}
