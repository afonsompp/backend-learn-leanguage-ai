import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { OAuthConfigService } from '@config/oauth.config.service';
import { HttpStrategy } from './strategy/http.strategy';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { OAuthGuard } from '@core/security/auth/guard/oauth.guard';

@Module({
  imports: [PassportModule],
  providers: [
    HttpStrategy,
    AuthService,
    OAuthConfigService,
    ScopesGuard,
    OAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthorizationModule {}
