import { Module } from '@nestjs/common';
import { HttpStrategy } from './service/http.strategy';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { AuthService } from './service/auth.service';
import { AuthConfigService } from './config/auth.config.service';
import { ScopesGuard } from './service/scopes/scopes.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),
    PassportModule,
  ],
  providers: [HttpStrategy, AuthService, AuthConfigService, ScopesGuard],
  exports: [AuthService],
})
export class AuthModule {}
