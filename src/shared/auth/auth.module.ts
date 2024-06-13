import { Module } from '@nestjs/common';
import { HttpStrategy } from './http.strategy';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { AuthService } from './auth.service';
import { AuthConfigService } from './config/auth.config.service';
import { ScopesGuard } from './scopes/scopes.guard';
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
