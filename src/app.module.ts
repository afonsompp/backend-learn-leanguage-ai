import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PropertiesConfig from './config/properties.config';
import { AwsConfigService } from '@config/aws.config.service';
import { OAuthConfigService } from '@config/oauth.config.service';
import { DatabaseModule } from '@core/database/database.module';
import { SecurityModule } from '@core/security/security.module';
import { SystemModule } from '@app/system/system.module';
import { UserModule } from '@app/user/user.module';
import { LoggingMiddleware } from '@core/logs/middleware/default-logging.middleware';
import { AIModule } from '@shared/ai/AI.module';
import { OpenaiConfigService } from '@config/openai.config.service';
import { StoryModule } from '@app/features/story/story.module';
import { ScopesGuard } from '@core/security/scopes/scopes.guard';
import { OAuthGuard } from '@core/security/auth/guard/oauth.guard';
import { HttpClientService } from '@core/client/service/http-client.service';
import { HttpClientModule } from '@core/client/http-client.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [PropertiesConfig],
    }),
    SecurityModule,
    SystemModule,
    DatabaseModule,
    UserModule,
    AIModule,
    StoryModule,
    HttpModule,
    HttpClientModule,
  ],
  providers: [
    AwsConfigService,
    OAuthConfigService,
    OpenaiConfigService,
    ScopesGuard,
    OAuthGuard,
    HttpClientService,
  ],
  exports: [AwsConfigService, OAuthConfigService, OpenaiConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
