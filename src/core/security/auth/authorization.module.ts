import { Module } from '@nestjs/common';
import { HttpStrategy } from './service/http.strategy';
import { AuthService } from './service/auth.service';
import { ScopesGuard } from './service/scopes/scopes.guard';
import { PassportModule } from '@nestjs/passport';
import { OAuthConfigService } from '../../../config/oauth.config.service';

@Module({
  imports: [PassportModule],
  providers: [HttpStrategy, AuthService, OAuthConfigService, ScopesGuard],
  exports: [AuthService],
})
export class AuthorizationModule {}
