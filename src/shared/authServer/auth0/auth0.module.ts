import { Module } from '@nestjs/common';
import { Auth0TokenService } from './service/auth0-token.service';
import { AuthApiConfigService } from './config/auth-api.config.service';
import { ConfigModule } from '@nestjs/config';
import authApiConfig from './config/auth-api.config';
import { HttpModule } from '@nestjs/axios';
import { Auth0IdpTokenService } from './idp/auth0-idp-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authApiConfig],
    }),
    HttpModule,
  ],
  providers: [Auth0TokenService, AuthApiConfigService, Auth0IdpTokenService],
  exports: [Auth0IdpTokenService],
})
export class Auth0Module {}
