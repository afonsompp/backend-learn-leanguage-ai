import { Module } from '@nestjs/common';
import { AdminTokenService } from './service/admin-token.service';
import { AuthApiConfigService } from './config/auth-api.config.service';
import { ConfigModule } from '@nestjs/config';
import authApiConfig from './config/auth-api.config';
import { HttpModule } from '@nestjs/axios';
import { IdpTokenService } from './service/idp-token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authApiConfig],
    }),
    HttpModule,
  ],
  providers: [AdminTokenService, AuthApiConfigService, IdpTokenService],
  exports: [IdpTokenService],
})
export class IdpModule {}
