import { Module } from '@nestjs/common';
import { AdminTokenService } from './service/admin-token.service';
import { HttpModule } from '@nestjs/axios';
import { IdpTokenService } from './service/idp-token.service';
import { OAuthConfigService } from '../../../config/oauth.config.service';

@Module({
  imports: [HttpModule],
  providers: [AdminTokenService, OAuthConfigService, IdpTokenService],
  exports: [IdpTokenService],
})
export class IdpModule {}
